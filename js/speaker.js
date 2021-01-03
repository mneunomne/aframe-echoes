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

    // set sphere propeties
    el.setAttribute('color', "#" + randomColor)
    el.setAttribute('radius', Math.random()*0.5 + 0.5)
    this.cur_index = 0

    let audio_list = window.db_audios.filter(a => a.from === this.data.name)
    this.audio_list = audio_list

    this.show_names = false
    this.show_orbits = false
    
    // Audios
    this.createAudioEntity()

    this.nameTextDisplay()

    this.audioTextSetup()

    this.addEvents()

    this.calculatePosition()

    // this.setupAudioMeter()

    // position in random point 
    // const area = 30
    // var worldPoint = {x: center.x + (Math.random() * area - area/2), y: center.y + (Math.random() * 10 - 10/2), z: center.z + (Math.random() * area - area/2)};
    // el.setAttribute('position', worldPoint);

  },

  calculatePosition () {
    const max_radius = 50
    const min_radius = 10
    this.vel = (Math.random() * 0.025) - 0.012
    this.theta = 0
    this.radiusX = min_radius + (Math.random() * max_radius - min_radius)
    this.radiusY = min_radius + (Math.random() * max_radius - min_radius)
    this.pos = {x: 0, y: 0, z: 0}

    const curve = new THREE.EllipseCurve(
      0,  0,            // ax, aY
      this.radiusX, this.radiusY,           // xRadius, yRadius
      0,  2 * Math.PI,  // aStartAngle, aEndAngle
      false,            // aClockwise
      0                 // aRotation
    );
    
    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    
    // Create the final object to add to the scene
    this.ellipse = new THREE.Line( geometry, material );
    this.ellipse.rotation.set(
      THREE.Math.degToRad(90),
      THREE.Math.degToRad(0),
      THREE.Math.degToRad(0)
    )

    this.ellipse.visible = this.show_orbits

    this.el.object3D.parent.el.object3D.add(this.ellipse)

    this.el.object3D.parent.rotation.set(
      THREE.Math.degToRad(Math.random() * 60 - 30),
      THREE.Math.degToRad(0),
      THREE.Math.degToRad(0)
    );

    setInterval(this.orbit.bind(this), 10)
  },

  orbit () {
    this.theta+=this.vel
    this.pos = {x: this.radiusX * Math.cos( this.theta ), y: 0, z: this.radiusY * Math.sin( this.theta )};
    this.el.object3D.position.set(this.pos.x, this.pos.y, this.pos.z)
  },

  addEvents () {
    document.addEventListener('start', () => {
      this.playSound(this.cur_index)
    })
    document.addEventListener('show_names', () => {
      this.show_names = true
      this.name_el.setAttribute('visible', this.show_names)

    })
    document.addEventListener('hide_names', () => {
      this.show_names = false
      this.name_el.setAttribute('visible', this.show_names)
    })

    document.addEventListener('show_orbits', () => {
      this.show_orbits = true
      this.ellipse.visible = this.show_orbits
    })
    document.addEventListener('hide_orbits', () => {
      this.show_orbits = false
      this.ellipse.visible = this.show_orbits
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
      _el.setAttribute('sound', 'src: #' + audio_id + '; distanceModel: exponential;')
      _el.setAttribute('id', this.data.name_id + i)
      _el.addEventListener('sound-ended', (evt) => {
        this.cur_index = this.cur_index === this.audio_list.length-1 ? 0 : this.cur_index+1
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
    name_el.setAttribute('geometry', `primitive: plane;`)
    name_el.setAttribute('look-at', `#camera`)
    name_el.setAttribute('position', `0 0.6 -0.5;`)
    name_el.setAttribute('material', `shader: html; target: #name-el-${this.data.name_id}; ratio: height;`)
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
      text_el.setAttribute('look-at', `#camera`)
      text_el.setAttribute('position', `0 -0.6 -0.5;`)
      text_el.setAttribute('material', `shader: html; target: #text-el-${this.data.name_id}; ratio: height;`)
      this.el.appendChild(text_el)
    }
  },

  setupAudioMeter () {
    this.context = new AudioContext();
    this.processor = this.context.createScriptProcessor(2048, 1, 1);
    this.processor.onaudioprocess = function(evt){
      var input = evt.inputBuffer.getChannelData(0)
        , len = input.length   
        , total = i = 0
        , rms;
      while ( i < len ) total += Math.abs( input[i++] );
      rms = Math.sqrt( total / len );
      console.log(( rms * 100 ));
    };
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