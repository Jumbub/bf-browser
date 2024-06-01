import { memory, start } from '../visual';

function submit(event: SubmitEvent) {
  event.preventDefault();

  const { target } = event;
  if (!target) throw new Error('missing target');
  if (!(target instanceof HTMLFormElement)) throw new Error('wrong target');

  const data = new FormData(target);
  const code = String(data.get('code') ?? '');
  const input = String(data.get('input') ?? '');
  const implementation = data.get('implementation');

  if (implementation === 'dumb') {
    start({ code, input });
  }
}

const form = document.getElementById('brainfuck') as HTMLFormElement | null;
if (!form) throw new Error('missing form');

form.addEventListener('submit', submit);

memory();
