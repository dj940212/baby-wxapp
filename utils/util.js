function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}



function calAge (birthday) {
    var birthTime = birthday.getTime()
    var today = Date.now()
    var interval = new Date(today - birthday)
    var yearTime = interval.getFullYear() - 1970
    var monthTime = interval.getMonth() + 1
    var dayTime = interval.getDate()
    var year = yearTime ? yearTime + "岁" : "" 
    var month = monthTime ? monthTime+ "个月" : ""
    var day = dayTime ? dayTime+"天" : ""
    return year + month + day 
}

module.exports = {
  formatTime: formatTime,
  calAge : calAge
}
