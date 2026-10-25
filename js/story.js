(() => {
const dialog=document.querySelector('.proof-viewer');
if(typeof dialog.showModal!=='function')return;
const image=document.querySelector('#proof-image'),caption=document.querySelector('#proof-caption'),stage=document.querySelector('.proof-stage'),fit=document.querySelector('#proof-fit'),close=document.querySelector('#proof-close');
let sourceLink=null;
for(const link of document.querySelectorAll('[data-proof]'))link.addEventListener('click',event=>{
 if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 event.preventDefault();sourceLink=link;image.src=link.href;image.alt=link.querySelector('img').alt;caption.textContent=link.closest('figure').querySelector('figcaption').textContent;
 stage.classList.remove('actual-size');stage.scrollTo(0,0);fit.setAttribute('aria-pressed','false');fit.textContent='Actual size';dialog.showModal();document.body.classList.add('viewer-open');close.focus();
});
close.addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('viewer-open');sourceLink?.focus();});
fit.addEventListener('click',()=>{const actual=stage.classList.toggle('actual-size');fit.setAttribute('aria-pressed',String(actual));fit.textContent=actual?'Fit to screen':'Actual size';stage.scrollTo(0,0);});
})();
