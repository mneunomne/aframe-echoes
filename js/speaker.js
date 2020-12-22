/**
 * Creates a grid of entities based on the given template
 * Place at the center of the grid you wish to create
 * Requires aframe-template-component
 */
AFRAME.registerComponent('speaker', {
  schema: {
    name: {type: 'string'}
  },

  init: function() {
    var el = this.el;
    var center = el.getAttribute('position');

    const randomColor = Math.floor(Math.random()*16777215).toString(16)
    
    el.setAttribute('color', "#" + randomColor)

    console.log(window.speakers[this.data.name], this.data.name)

    var name = this.data.name

    var index = 0

    var audios = window.speakers[this.data.name].map(n => n.replace('.wav',''))
    
    
    audios.map((n, i) => {
      var _el = document.createElement('a-entity');
      _el.setAttribute('sound', 'src: #' + audios[i] + ';')
      _el.setAttribute('id', this.data.name + i)
      _el.addEventListener('sound-ended', (evt) => {
        console.log('sound ended', evt)
        index = index === audios.length-1 ? 0 : index+1
        this.playSound(index)
      })
      el.appendChild(_el)
    })


    document.querySelector('button').addEventListener('click', () => {
      // el.setAttribute('sound', 'src: #' + audios[index] + ';  autoplay: true; poolSize: 20;')
      console.log('index', index)
      this.playSound(index)
    })

    const area = 20 
    var worldPoint = {x: center.x + (Math.random() * area - area/2), y: center.y, z: center.z + (Math.random() * area - area/2)};
    el.setAttribute('position', worldPoint);

  },

  playSound: function(index) {
    let el = this.el.querySelector('#' + this.data.name + index)

    console.log('el', el, this.data.name, index)

    this.el.querySelector('#' + this.data.name + index).components.sound.playSound()
  }
});