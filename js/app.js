/*
 * Create a list that holds all of your cards
 */
/**
 * 样式列表
 */
var iconList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-anchor', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
/**
 * 初始化所有卡片样式
 * @param {Array} array 
 */
function render(array) {
    var cards = document.getElementsByClassName('card');
    array.forEach(function(icon, index) {
        cards[index].className = 'card';
        cards[index].children[0].className = 'fa ' + icon;
    })
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
var cardOpen; // 点击单个元素
var count = 0; // 统计匹配成功的数量 8个即为胜利
var moves = 0; // 计算步数
var timersId = []; // 存放timeoutId列表
/**
 * 页面游戏元素点击
 */
document.getElementsByClassName('deck')[0].onclick = function(me) {
    meSrc = me.srcElement;
    if (meSrc.className.indexOf('card') === -1 || meSrc.className.indexOf('card match') > -1 || meSrc === cardOpen) return;
    meSrc.className = 'card open show';
    if (!cardOpen) return cardOpen = meSrc;
    moves++;
    // 匹配成功
    if (cardOpen.children[0].className === meSrc.children[0].className) {
        count++;
        meSrc.className = cardOpen.className += 'card match animated rubberBand';
        setTimeout(function() {
                meSrc.className = cardOpen.className = 'card match';
                cardOpen = undefined;
            }, 300)
            // 游戏胜利
        if (count === 8) show(document.getElementById('winbox'));
        // 匹配失败
    } else {
        meSrc.className = cardOpen.className += 'card open show animated shake';
        currCardOpen = cardOpen;
        setTimeout(function() {
            meSrc.className = currCardOpen.className = 'card';
        }, 300)
        cardOpen = null;
    }
    // 更新页面上的步数
    document.getElementsByClassName('moves')[0].innerText = moves;
    document.getElementsByClassName('moves')[1].innerText = moves;
};
/**
 * 初始化游戏
 */
function reset() {
    updateStar(3);
    timersId.forEach(function(timerId) {
        clearTimeout(timerId);
    })
    timersId = [];
    cardOpen = null;
    count = 0;
    moves = 0;
    setTimeUpdateStar([2 * 60 * 1000, 5 * 60 * 1000, 10 * 60 * 1000]);
    document.getElementsByClassName('moves')[0].innerText = 0;
    render(shuffle(iconList))
}
/**
 * 隐藏元素
 */
function hide(ele) {
    ele.style.display = "none";
}
/**
 * 显示元素
 */
function show(ele) {
    ele.style.display = "block";
}
/**
 * 更新页面星星数
 * @param {Number} number
 */
function updateStar(number) {
    var stars = Array.from(document.getElementsByClassName('stars')[0].children);
    document.getElementsByClassName('stars')[1].innerText = number;
    stars.forEach(function(star, index) {
        star.children[0].className = index < number ? 'fa fa-star' : 'fa fa-star-o';
    })
}
/**
 * 设置星星评级时间规则
 * @param {Array} timers 例如[2*60*1000, 5*60*1000, 10*60*1000];
 */
function setTimeUpdateStar(timers) {
    timersId.push(setTimeout(function() {
        updateStar(2);
        timersId.push(setTimeout(function() {
            updateStar(1);
            timersId.push(setTimeout(function() {
                updateStar(0);
            }, timers[0]))
        }, timers[1]))
    }, timers[0]))
}

// 游戏过程中重置游戏
document.getElementsByClassName('restart')[0].onclick = reset;
// 胜利时点击重置游戏
document.getElementsByClassName('restart')[1].onclick = function() {
    hide(document.getElementById('winbox'));
    reset();
};
// 首次加载初始化游戏
document.addEventListener('DOMContentLoaded', reset);