let btn_play = document.querySelector('#btn_play')

btn_play.addEventListener('click', () => {
  var event = new Event('start')
  document.dispatchEvent(event)
})


let show_names = document.querySelector("input[name=show_names]");
show_names.addEventListener('change', function() {
  if (this.checked) {
    var event = new Event('show_names')
    document.dispatchEvent(event)
  } else {
    var event = new Event('hide_names')
    document.dispatchEvent(event)
  }
});

let show_orbits = document.querySelector("input[name=show_orbits]");
show_orbits.addEventListener('change', function() {
  if (this.checked) {
    var event = new Event('show_orbits')
    document.dispatchEvent(event)
  } else {
    var event = new Event('hide_orbits')
    document.dispatchEvent(event)
  }
});