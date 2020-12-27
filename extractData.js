const fs = require('fs');

let filename = "result_2020-12-19.json"

function getData () {
  let rawdata = fs.readFileSync('telegram_data/' + filename);
  let telegram_data = JSON.parse(rawdata);

  // .filter(m => m.type === 'message' && m.text !== '')
  let messages = telegram_data.messages
  let audio_texts_pairs = messages.filter(
    m => (m.text === '' && m.media_type === 'voice_message') && m.id !== 3 || m.text !== ''
  )
  
  audio_texts_pairs = audio_texts_pairs.map(
    (m, index) => {
      var { from, file, text, id} = m
      if (m.text === '' && m.media_type === 'voice_message') {
        let next_text = audio_texts_pairs[index+1].text
        console.log('next_text',next_text)
        return {
          from,
          file,
          id,
          next_text
        }
      } else {
        return false
      }
    }
  )
  // console.log('audio_texts_pairs', audio_texts_pairs)
  return audio_texts_pairs
}

let data = JSON.stringify(getData(), null, 4);
fs.writeFileSync(`logs/${new Date().toISOString().replace(/T/, '').replace(/\..+/, '')}.json`, data)