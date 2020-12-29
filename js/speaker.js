/**
 * Creates a grid of entities based on the given template
 * Place at the center of the grid you wish to create
 * Requires aframe-template-component
 */
AFRAME.registerComponent('speaker', {
  schema: {
    name: {type: 'string'},
    name_id: {type: 'string'}
  },

  init: function() {
    var el = this.el;
    var center = el.getAttribute('position');
    const randomColor = Math.floor(Math.random()*16777215).toString(16)
    el.setAttribute('color', "#" + randomColor)
    var index = 0

    let audio_list = window.db_audios.filter(a => a.from === this.data.name)
    this.audio_list = audio_list

    // NAME WRAPPER
    var name_target_el_wrapper = document.createElement('div');
    name_target_el_wrapper.setAttribute('id', 'name-' + this.data.name_id)
    name_target_el_wrapper.setAttribute('style', "width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: -1; overflow: hidden")
    document.body.appendChild(name_target_el_wrapper)

    var name_target_el = document.createElement('div');
    name_target_el.setAttribute('style', "background: #000000; color: white; font-size: 46px; display: inline-block;")
    name_target_el.setAttribute('id', 'name-el-' + this.data.name_id)
    name_target_el.innerText = this.data.name
    document.querySelector('#name-' + this.data.name_id).appendChild(name_target_el)

    this.name_target_el = name_target_el


    // name el
    var name_el = document.createElement('a-entity');
    name_el.setAttribute('geometry', `primitive: plane;`)
    name_el.setAttribute('look-at', `#camera`)
    name_el.setAttribute('position', `0 0.6 -0.5;`)
    name_el.setAttribute('material', `shader: html; target: #name-el-${this.data.name_id}; ratio: height;`)
    // el.appendChild(name_el)


    // TEXT WRAPPER
    var text_target_el_wrapper = document.createElement('div');
    text_target_el_wrapper.setAttribute('id', 'text-' + this.data.name_id)
    text_target_el_wrapper.setAttribute('style', "width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: -1; overflow: hidden")
    document.body.appendChild(text_target_el_wrapper)

    var text_target_el = document.createElement('div');
    text_target_el.setAttribute('style', "background: #000000; color: white; font-size: 46px; display: inline-block;")
    text_target_el.setAttribute('id', 'text-el-' + this.data.name_id)
    text_target_el.innerText = ""
    document.querySelector('#text-' + this.data.name_id).appendChild(text_target_el)

    this.text_target_el = text_target_el
    
    audio_list.map((a, i) => {
      // create audio entity
      var _el = document.createElement('a-entity');
      let audio_id = a.file.replace('.mp3', '').replace('convert_dest/', "")
      _el.setAttribute('sound', 'src: #' + audio_id + '; distanceModel: exponential;')
      _el.setAttribute('id', this.data.name_id + i)
      _el.addEventListener('sound-ended', (evt) => {
        index = index === audio_list.length-1 ? 0 : index+1
        this.playSound(index)
      })
      el.appendChild(_el)
    })

    document.querySelector('button').addEventListener('click', () => {
      this.playSound(index)
    })

    const area = 30
    var worldPoint = {x: center.x + (Math.random() * area - area/2), y: center.y + (Math.random() * 10 - 10/2), z: center.z + (Math.random() * area - area/2)};
    el.setAttribute('position', worldPoint);

  },

  playSound: function(index) {
    this.el.querySelector('#' + this.data.name_id + index).components.sound.playSound()
    this.name_target_el.innerText = index
    console.log('current audio', this.audio_list[index].next_text)
    // name el
    this.text_target_el.innerText = this.audio_list[index].next_text

    
    // this.text_el.setAttribute('material', `shader: html; target: #text-el-${this.data.name_id}; ratio: height;`)

    if (document.querySelector(`#text-plane-${this.data.name_id}`)) {
      document.querySelector(`#text-plane-${this.data.name_id}`).remove()
    }

    if (this.audio_list[index].next_text !== "") {
      var text_el = document.createElement('a-entity');
      text_el.setAttribute('geometry', `primitive: plane;`)
      text_el.setAttribute('id', `text-plane-${this.data.name_id}`)
      text_el.setAttribute('look-at', `#camera`)
      text_el.setAttribute('position', `0 -0.6 -0.5;`)
      text_el.setAttribute('material', `shader: html; target: #text-el-${this.data.name_id}; ratio: height;`)
      this.el.appendChild(text_el)
    }



    console.log(this.text_el.components['look-at'].play())

  }
});