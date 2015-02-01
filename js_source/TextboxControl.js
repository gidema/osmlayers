'use_strict';
if (!OsmLayers.Control) OsmLayers.Control = {};
OsmLayers.Control.TextBoxControl=OpenLayers.Class(OpenLayers.Control, {
  
  labelDiv: null,
  input: null,
  form: null,
  listener: null,
  
  draw:function(px) {
    OpenLayers.Control.prototype.draw.apply(this,arguments);

     this.labelDiv=document.createElement ('div');
    this.labelDiv.className='label';

    this.input= document.createElement ('input');
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('name', 'q');
    this.input.control=this;

    this.form=document.createElement ('form');
    this.form.style.display='inline';
    this.form.appendChild(this.input);
    this.form.control=this;
    this.form.onsubmit=this.formOnSubmit;

    this.div.appendChild(this.labelDiv);
    this.div.appendChild(this.form);
    return this.div;
  },
  
  setListener: function(listener) {
    this.listener = listener;
  },
  
  formOnSubmit: function() {
    this.control.listener.textChanged(this.elements.q.value);
  },
  CLASS_NAME:'OsmLayers.Control.TextBoxControl'
});