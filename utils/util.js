function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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
    var year = yearTime ? yearTime + "岁" : "" 
    var month = interval.getMonth() + 1
    var day = interval.getDate()

    

    return year + month + "个月"+ day + "天"
}

module.exports = {
  formatTime: formatTime,
  calAge : calAge
}
