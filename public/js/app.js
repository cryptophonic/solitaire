var suits = [ "clubs", "diamonds", "hearts", "spades" ]
var ranks = [ "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king" ] 
var alphabet = "abcdefghijklmnopqrstuvwxyz"

var deck = Array()
for (var i=0; i<54; i++) {
    deck.push(i)
}

function getSelector(card) {
    if (card < 52) {
        var suit = Math.floor(card / 13)
        var rank = card % 13
        return ranks[rank] + "_of_" + suits[suit]
    } else if (card == 52) {
        return "black_joker"
    } else if (card == 53) {
        return "red_joker"
    }
}

function getAlt(card) {
    if (card < 52) {
        var suit = Math.floor(card / 13)
        var rank = card % 13
        return ranks[rank] + " of " + suits[suit]
    } else if (card == 52) {
        return "joker 1"
    } else if (card == 53) {
        return "joker 2"
    }
}

function setDeck(index, card) {
    deck[index] = card
    $('#card-' + index).attr('src', "images/SVG-cards-1.3/" + getSelector(card) + ".svg")
    $('#card-' + index).attr('alt', getAlt(card))
}

function initial() {
    for (var i=0; i<54; i++) {
        setDeck(i, i)
    }
}

function shuffle() {
    var shuffled = Array()
    for (var i=0; i<54; i++) {
        var rnd = Math.floor((Math.random() * deck.length));
        shuffled.push(deck[rnd])
        deck.splice(rnd, 1)
    }
    deck = shuffled
    for (var i=0; i<54; i++) {
        setDeck(i, deck[i])
    }
    $('#output').val('')
}

function step1() {
    for (var i=0; i<54; i++) {
        if (deck[i] == 52) {
            if (i == 53) { // last card
                for (var j=52; j>0; j--) {
                    setDeck(j+1, deck[j])
                }
                setDeck(1, 52)
            } else {
                var to = (i + 1) % 54
                setDeck(i, deck[to])
                setDeck(to, 52)
            }
            return
        }
    }
}

function step2() {
    for (var i=0; i<54; i++) {
        if (deck[i] == 53) {
            if (i == 53) { // last card
                for (var j=52; j>1; j--) {
                    setDeck(j+1, deck[j])
                }
                setDeck(2, 53)
            } else if (i == 52) { // second to last card
                for (var j=51; j>0; j--) {
                    setDeck(j+1, deck[j])
                }
                setDeck(1, 53)
            } else {
                var to1 = (i + 2) % 54
                var to2 = (i + 1) % 54
                setDeck(i, deck[to2])
                setDeck(to2, deck[to1])
                setDeck(to1, 53)
            }
            return
        }
    }
}

function step3() {
    var tmp = Array()
    var joker1 = undefined
    var joker2 = undefined
    for (var i=0; i<54; i++) {
        tmp.push(deck[i])
    }
    for (i=0; i<54; i++) {
        if (tmp[i] == 52 || tmp[i] == 53) {
            if (joker1 == undefined) joker1 = i
            else joker2 = i
        }
    }
    var card = 53
    for (i=joker1-1; i>=0; i--) {
        setDeck(card--, tmp[i])
    }
    for (i=joker2; i>=joker1; i--) {
        setDeck(card--, tmp[i])
    }
    for (i=53; i>joker2; i--) {
        setDeck(card--, tmp[i])
    }
}

function step4(input) {
    if (input == null) {
        var last = deck[53] + 1;
    } else {
        last = input
    }
    if (last < 53) {
        var tmp = Array()
        for (var i=0; i<54; i++) {
            tmp.push(deck[i])
        }
        var card = 52
        for (i=0; i<last; i++) {
            setDeck(card--, tmp[last-i-1])
        }
        for (i=0; i<53-last; i++) {
            setDeck(i, tmp[i+last])
        }
    }
}

function step5() {
    var index = deck[0]
    if (index < 53) {
        var value = deck[index+1]
        if (value < 52) {
            var output = (value % 26) + 1
        } else {
            // n/a joker
            var output = "X"
        }
    } else {
        // 2nd joker is top card - index too large
        var output = "X"
    }
    // Update encrypt table
    var mode = $('input[name=mode]:checked').val()
    console.log("mode=" + mode)
    for (var i=0; i<26; i++) {
        var td = "#encrypt_" + alphabet[i]
        if (output === "X") {
            $(td).html('-')
        } else {
            if (mode === "encrypt") 
                $(td).html(alphabet[(i + output) % 26])
            else
                $(td).html(alphabet[(26 + i - output) % 26])
        }
    }
    // Update textarea
    //console.log("Output=" + output)
    var el = $('#output')
    var cur = el.val()
    if (cur.length > 0) {
        cur = cur + " " + output
    } else {
        cur = output
    }
    el.val(cur)
}

function fullround() {
    step1()
    step2()
    step3()
    step4()
    step5()
}

function keyround(key) {
    step1()
    step2()
    step3()
    step4()
    step4(key)
}

function keydeck() {
    initial()
    var key = $("#key").val()
    for (var i=0; i<key.length; i++) {
        var c = alphabet.indexOf(key[i].toLowerCase()) + 1
        if (c > 0) keyround(c)
    }
    $("#key").val('')
}

function doclear() {
    $("#output").val('')
    for (var i=0; i<26; i++) {
        $("#encrypt_" + alphabet[i]).html("-")
    }
}

$(function() {
  
    for (var i=0; i<54; i++) {
        var index = 53 - i
        var card = deck[index]
        var selector = getSelector(card)
        var alt = getAlt(card)
        var indent = i * 14
        var img = '<img id="card-' + index + '" class="card" style="left: ' + indent + 'px"/>'
        $('#deck').append(img)
    }
    shuffle()

})