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

    const audios = window.speakers[this.data.name].map(n => n.replace('.wav',''))

    var index = 0

    document.querySelector('button').addEventListener('click', function() {
      el.setAttribute('sound', 'src: #' + audios[index] + ';  autoplay: true; poolSize: 20;')
    })

    el.addEventListener('sound-ended', (evt) => {
      console.log('sound ended', evt)
      index = index === audios.length-1 ? 0 : index+1 
      evt.target.setAttribute('sound', 'src: #' + audios[index] + '; autoplay: true; poolSize: 20;')

    })

    el.addEventListener('sound-loaded', (evt) => {
      console.log('sound loaded', evt)
      evt.target.components.sound.playSound();
    })

    const area = 20 
    var worldPoint = {x: center.x + (Math.random() * area - area/2), y: center.y, z: center.z + (Math.random() * area - area/2)};
    el.setAttribute('position', worldPoint);

  },

  getRandomAngleInRadians: function() {
    return Math.random()*Math.PI*2;
  },

  randomPointOnCircle: function (radius, angleRad) {
    var x = Math.cos(angleRad)*radius;
    var y = Math.sin(angleRad)*radius;
    return {x: x, y: y};
  }
});