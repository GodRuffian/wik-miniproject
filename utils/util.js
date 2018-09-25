const formatTime = (date, config) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

    if (config.date) {
        return [year, month, day].map(formatNumber).join('/')
    } else {
        return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const removeHTMLTag = str => {
    str = str.replace(/<\/?[^>]*>/g, ''); // 去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); // 去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g, '\n'); // 去除多余空行
    str = str.replace(/&nbsp;/ig, ''); // 去掉&nbsp;
    str = str.replace(/\s/g, ''); // 将空格去掉
    return str;
}
const getFirstImage = str => {
    // 截取出图片  <img />
    var re = /<img[^>]+>/g;
    var a = str.match(re);
    if (a) {
        return a[0].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
    } else {
        return '';
    }
}

const intervalToNow = timespan =>  {
    var dateTime = new Date(timespan * 1000);
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1;
    var day = dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
    var now = new Date();
    var nowNew = Date.parse(now);
    var timeSpanStr = void 0;
    var milliseconds = nowNew - timespan * 1000;
    var nowDay = now.getDate();
    var pubDay = dateTime.getDate();
    var dayInterval = nowDay - pubDay;

    if (1000 * 60 * 10 >= milliseconds) {
        timeSpanStr = '刚刚';
    } else if (1000 * 60 * 10 < milliseconds && milliseconds <= 1000 * 60 * 60) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60)) + '分钟前';
    } else if (dayInterval === 0 && 1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
    } else if ((dayInterval === 1 || -30 <= dayInterval <= -27) && milliseconds < 1000 * 60 * 60 * 24 * 2) {
        timeSpanStr = '昨天';
    } else {
        timeSpanStr = year + '/' + month + '/' + day;
    }
    return timeSpanStr;
}

module.exports = {
  formatTime: formatTime,
    removeHTMLTag: removeHTMLTag,
    getFirstImage: getFirstImage,
    intervalToNow: intervalToNow
}
