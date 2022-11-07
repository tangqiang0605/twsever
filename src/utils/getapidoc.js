const fs = require('fs');

const path = require('path');

const {TWSERVER_CONFIG}=require('../../workplace/configs/config')

const regStyle = /if[(mapper([\s\S]*?}/g;

let str = '';
// for ()
fs.readFile('./workplace/routers/author.js', 'utf8', function (err, datastr) {
  if (err) return console.log('wrong');

  let context = regStyle.exec(datastr);
  datastr.match(regStyle).forEach(val => {
    val.match(/is[\S\s]*?'[\S\s]*?'/).forEach(val => {
      val.match(/is[\w]*/).forEach(val => console.log(val));
    })
  }
  )
})