(function(){
  const display = document.getElementById('display');
  const history = document.getElementById('history');
  const keys = document.getElementById('keys');

  let current = '0';
  let previous = null;
  let operator = null;
  let justCalculated = false;

  function updateDisplay(){
    display.textContent = current;
    const hist = [previous, operator].filter(Boolean).join(' ');
    history.textContent = hist || '\u00A0';
  }

  function inputDigit(d){
    if(justCalculated){ current = '0'; justCalculated = false; }
    if(current === '0'){ current = d; }
    else if(current === '-0'){ current = '-' + d; }
    else { current += d; }
    updateDisplay();
  }

  function inputDot(){
    if(justCalculated){ current = '0'; justCalculated = false; }
    if(!current.includes('.')){ current += (current === '' ? '0.' : '.'); }
    updateDisplay();
  }

  function clearAll(){ current='0'; previous=null; operator=null; justCalculated=false; updateDisplay(); }

  function del(){
    if(justCalculated){ return; }
    if(current.length <= 1 || (current.length === 2 && current.startsWith('-'))){ current = '0'; }
    else { current = current.slice(0,-1); }
    updateDisplay();
  }

  function setOperator(op){
    if(op === '%'){
      const num = parseFloat(current);
      if(!isNaN(num)){ current = (num/100).toString(); updateDisplay(); }
      return;
    }
    if(operator && previous !== null && !justCalculated){
      doCalculate();
    }
    previous = current;
    operator = op;
    justCalculated = false;
    current = '0';
    updateDisplay();
  }

  function doCalculate(){
    const a = parseFloat(previous);
    const b = parseFloat(current);
    if(isNaN(a) || isNaN(b) || !operator){ return; }
    let r;
    switch(operator){
      case '+': r = a + b; break;
      case '-': r = a - b; break;
      case '*': r = a * b; break;
      case '/':
        if(b === 0){ current = 'Error'; previous=null; operator=null; justCalculated=true; updateDisplay(); return; }
        r = a / b; break;
      default: return;
    }
    if(!Number.isInteger(r)){
      r = parseFloat(r.toFixed(12));
    }
    current = r.toString();
    previous = null; operator = null; justCalculated = true;
    updateDisplay();
  }

  keys.addEventListener('click', (e)=>{
    const btn = e.target.closest('button.key');
    if(!btn) return;
    const n = btn.getAttribute('data-num');
    const op = btn.getAttribute('data-op');
    const act = btn.getAttribute('data-action');
    if(n !== null){ inputDigit(n); return; }
    if(op){ setOperator(op); return; }
    if(act === 'dot'){ inputDot(); return; }
    if(act === 'clear'){ clearAll(); return; }
    if(act === 'delete'){ del(); return; }
    if(act === 'equals'){ doCalculate(); return; }
  });

  document.addEventListener('keydown', (ev)=>{
    const k = ev.key;
    if(/^[0-9]$/.test(k)){ inputDigit(k); return; }
    if(k === '.' ){ inputDot(); return; }
    if(k === '+' || k === '-' || k === '*' || k === '/') { setOperator(k); return; }
    if(k === '%'){ setOperator('%'); return; }
    if(k === 'Enter' || k === '='){ ev.preventDefault(); doCalculate(); return; }
    if(k === 'Backspace'){ del(); return; }
    if(k === 'Escape'){ clearAll(); return; }
  });

  updateDisplay();
})();