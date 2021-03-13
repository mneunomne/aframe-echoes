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

    this.cameraEl = document.getElementById('camera')

    this.roomEl = document.getElementById('room')

    // set sphere propeties
    el.setAttribute('color', "#" + randomColor)
    
    // variable sphere raduis 
    // el.setAttribute('radius', Math.random()*0.5 + 0.5)
    // stablesphere radius
    el.setAttribute('radius', 0.5)

    this.cur_index = 0

    let speakers_list = window.db_audios.map(a => a.from)
    speakers_list = speakers_list.filter((v,i) => speakers_list.indexOf(v) === i)
    this.speakers_list = speakers_list
    speaker_index = speakers_list.indexOf(this.data.name)
    this.speaker_index = speaker_index
    console.log('speaker_index', speaker_index)

    let audio_list = window.db_audios.filter(a => a.from === this.data.name)
    this.audio_list = audio_list

    this.show_names = false
    this.show_orbits = false
    
    // Audios
    this.createAudioEntity()

    this.nameTextDisplay()

    this.audioTextSetup()

    this.addEvents()

    this.createSilhouette()

    // position in random point 
    const w = 9
    const z = 18

    this.walker = new Walker(w, z)

    
    var worldPoint = {x: center.x + (Math.random() * w - w/2), y: 1.6, z: center.z + (Math.random() * z - z/2)};
    el.setAttribute('position', worldPoint);
    this.walker.step(el.object3D)
    setInterval(() => {
      this.walker.step(el.object3D)
    }, 10)

  },

  createSilhouette () {

    var _el = document.createElement('a-image')
    _el.setAttribute('src', '#silhouette-' + getRandomInt(0, 5))
    _el.setAttribute('width', '1')
    _el.setAttribute('height', '1.8')
    _el.setAttribute('position', '0 -0.8 0')
    _el.setAttribute('look-at-y', `#camera`)
    _el.setAttribute('material', `alphaTest: 0.1;`)
    _el.setAttribute('visible', false)
    this.img = _el
    this.el.appendChild(this.img)
  },

  addEvents () {
    document.addEventListener('start', () => {
      // if (this.speaker_index == 0) {
      this.playSound(this.cur_index)
      // }
    })
    document.addEventListener('show_names', () => {
      this.show_names = true
      this.name_el.setAttribute('visible', this.show_names)
      this.img.setAttribute('visible', this.show_names)

    })
    document.addEventListener('hide_names', () => {
      this.show_names = false
      this.name_el.setAttribute('visible', this.show_names)
      this.img.setAttribute('visible', this.show_names)
    })

    document.addEventListener('show_orbits', () => {
      this.show_orbits = true
      this.ellipse.visible = this.show_orbits
    })
    document.addEventListener('hide_orbits', () => {
      this.show_orbits = false
      this.ellipse.visible = this.show_orbits
    })

    document.addEventListener('next-sound', (evt) => {
      // console.log('evt',evt)
      if (evt.detail === this.data.name) {
        this.playSound(this.cur_index)
      }
    })
      
    this.el.addEventListener('click', this.onClick.bind(this))
  },

  onClick () {
    // this.getPosInterval = setInterval(() => {
      // console.log('this.pos', this.pos)
      // this.cameraEl.object3D.position.set(this.pos.x + 3, this.pos.y, this.pos.z - 1)
    // }, 10)
  },

  createAudioEntity () {
    this.audio_list.map((a, i) => {
      // create audio entity
      var _el = document.createElement('a-entity');
      let audio_id = a.file.replace('.mp3', '').replace('convert_dest/', "")
      _el.setAttribute('sound', 'src: #' + audio_id + ';volume: 0.5;' ) // + '; distanceModel: exponential;'
      _el.setAttribute('id', this.data.name_id + i)
      _el.addEventListener('sound-ended', (evt) => {
        this.cur_index = this.cur_index === this.audio_list.length-1 ? 0 : this.cur_index+1

        /*
        let selectable_speakers = this.speakers_list.filter(s => s !== this.data.name)
        let next_speaker = selectable_speakers[Math.floor(Math.random() * selectable_speakers.length)];
        var event = new CustomEvent('next-sound', {detail: next_speaker})
        document.dispatchEvent(event)
        */
        
        this.playSound(this.cur_index)
      })
      this.el.appendChild(_el)
    })
  },

  nameTextDisplay () {
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

    var name_el = document.createElement('a-entity');
    name_el.setAttribute('geometry', `primitive: plane; height: 0.2;`)
    name_el.setAttribute('look-at-y', `#camera`)
    name_el.setAttribute('position', `0 0.3 0;`)
    name_el.setAttribute('material', `shader: html; side: double; target: #name-el-${this.data.name_id}; ratio: height;`)
    name_el.setAttribute('visible', this.show_names)
    this.el.appendChild(name_el)
    this.name_el = name_el
  },

  audioTextSetup () {
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
  },

  audioTextDisplay (text) {
    this.text_target_el.innerText = text
    // name el
    if (document.querySelector(`#text-plane-${this.data.name_id}`)) {
      document.querySelector(`#text-plane-${this.data.name_id}`).remove()
    }

    if (text !== "") {
      var text_el = document.createElement('a-entity');
      text_el.setAttribute('geometry', `primitive: plane;`)
      text_el.setAttribute('id', `text-plane-${this.data.name_id}`)
      text_el.setAttribute('look-at-y', `#camera`)
      text_el.setAttribute('position', `0 -0.6 -0.5;`)
      text_el.setAttribute('material', `shader: html; target: #text-el-${this.data.name_id}; ratio: height;`)
      this.el.appendChild(text_el)
    }
  },

  playSound: function(index) {
    let audio_entity = this.el.querySelector('#' + this.data.name_id + index).components.sound
    audio_entity.playSound()
    
    // this.audioTextDisplay(this.audio_list[index].next_text)
    
    /*
    // let src_el = document.querySelector(audio_entity.attrValue.src)
    let src_audio_el = document.getElementById(audio_entity.data.src.replace('convert_dest/', '').replace('.mp3', ''))
    var source = this.context.createMediaElementSource(src_audio_el)
    source.connect(this.processor)
    source.connect(this.context.destination)
    this.processor.connect(this.context.destination)
    */
  }
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Walker {
  constructor(width, height) {
    this.simplex = new SimplexNoise()
    this.tx = Math.random()*2 - 1;
    this.ty = Math.random()*2 -1;
    this.vel = Math.random() / 1000

    this.width = width 
    this.height = height
  }
  step(object3D) {
    let x = this.simplex.noise2D(this.tx, this.width)
    let y = this.simplex.noise2D(this.ty, this.height)
    // this.val = this.simplex.noise2D(this.tx, this.ty)
    object3D.position.set(x*this.width/2, object3D.position.y, y*this.height/2)
    this.tx+= this.vel;
    this.ty+= this.vel;
    
  }
}