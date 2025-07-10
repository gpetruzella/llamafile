import { html, useSignal, useEffect, useRef } from './index.js';
import { Portal } from './Portal.js';

// simple popover impl
export const Popover = (props) => {
  const isOpen = useSignal(false);
  const position = useSignal({ top: '0px', left: '0px' });
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  const togglePopover = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      position.value = {
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
      };
    }
    isOpen.value = !isOpen.value;
  };

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
      isOpen.value = false;
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return html`
    <span style=${props.style} ref=${buttonRef} onClick=${togglePopover}>${props.children}</span>
    ${isOpen.value && html`
      <${Portal} into="#portal">
        <div
          ref=${popoverRef}
          class="popover-content"
          style=${{
        top: position.value.top,
        left: position.value.left,
      }}
        >
          ${props.popoverChildren}
        </div>
      </${Portal}>
    `}
  `;
};
