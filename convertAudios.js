const fs = require('fs');
const { exec } = require("child_process");

const filename = "result_2020-12-19.json"
const dest_folder = `convert_dest/` // ${new Date().toISOString().replace(/T/, '').replace(/\..+/, '')}
const telegram_data_folder = 'telegram_data/'


function convertAudios () {
  let rawdata = fs.readFileSync(telegram_data_folder + filename);
  let telegram_data = JSON.parse(rawdata)

  let messages = telegram_data.messages

  let audios_messages = messages.filter(
    m => (m.text === '' && m.media_type === 'voice_message')
  )
  .map((m) => {
    // convert
    let src = m.file
    let dest = m.file.substring(m.file.lastIndexOf('/') + 1).replace('.ogg', '.mp3')
    console.log('src', src)
    
    exec(`opusdec --force-wav ${telegram_data_folder}/${src} - | sox - ${dest_folder}/${dest}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`)
          return
      }
      console.log(`stdout: ${stdout}`)
    })
  })
}

convertAudios()