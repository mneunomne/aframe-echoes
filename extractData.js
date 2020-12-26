const fs = require('fs');

let filename = "result_2020-12-19.json"

function getData () {
  let rawdata = fs.readFileSync('telegram_data/' + filename);
  let telegram_data = JSON.parse(rawdata);

  // .filter(m => m.type === 'message' && m.text !== '')
  let messages = telegram_data.messages
  let audio_texts_pairs = messages.filter(
    m => (m.text === '' && m.media_type === 'voice_message') || m.text !== ''
  ).map(
    m => m.text === '' && m.media_type === 'voice_message' ? m.file : m.text
  )
  console.log('audio_texts_pairs', audio_texts_pairs)
  return audio_texts_pairs
}

let data = JSON.stringify(getData(), null, 4);
fs.writeFileSync(`logs/${new Date().toISOString().replace(/T/, '').replace(/\..+/, '')}.json`, data)