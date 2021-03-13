/**
 * Room to have all speakers inside
 */
AFRAME.registerComponent('room', {
  schema: {
    w: {type: 'number'},
    h: {type: 'number'},
    z: {type: 'number'}
  },

  init: function() {
    var box = document.createElement('a-box');
    box.setAttribute('width', this.data.w)
    box.setAttribute('height', this.data.h)

    box.setAttribute('depth', this.data.z)
    box.setAttribute('side', "double")
    box.setAttribute('color', "gray")
    box.setAttribute('position', {x: 0, y: this.data.h/2, z: 0})
    this.el.appendChild(box)
  },
})