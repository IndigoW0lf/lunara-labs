export const CHARACTER_CELLS={B:[0,0],C:[1,0],D:[2,0],E:[0,1],F:[1,1],guide:[2,1]};
export const PHONE_ALERTS=[
 {from:'Sam',person:'B',app:'Messages',text:'Have you seen the photo in the group chat?',reply:'I was going to show you what I found on my walk. You can look when you’re finished.'},
 {from:'Jo',person:'C',app:'Messages',text:'Are we still meeting later?',reply:'I’m making a plan for this afternoon. There’s no need to answer during your search.'},
 {from:'Photo club',person:'F',app:'Photos',text:'A new photo has been added to the album.',reply:'The courtyard looks different in the afternoon light. Your notes will still be there when you go back.'},
 {from:'Lee',person:'E',app:'Messages',text:'I have a question for you…',reply:'I was wondering which book you chose. Let’s talk after you’ve finished what you’re doing.'}
];
export function glyph(name){
 const paths={message:'<path d="M5 5h14v11H9l-4 4V5Z"/><path d="M8 9h8M8 12h5"/>',notes:'<path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4"/>',photo:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="1.5"/><path d="m4 18 6-6 4 4 3-3 3 4"/>',settings:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',play:'<path d="m9 5 10 7-10 7V5Z"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>',sound:'<path d="m11 5-5 4H3v6h3l5 4V5Zm4 3c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',bell:'<path d="M5 17h14l-2-3v-4a5 5 0 0 0-10 0v4l-2 3Zm5 4h4"/>',home:'<path d="m3 11 9-8 9 8M6 10v11h12V10M10 21v-7h4v7"/>',arrow:'<path d="m14 5-7 7 7 7"/>',notice:'<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>',check:'<path d="m5 12 4 4L19 6"/>',phone:'<path d="M8 3H5a2 2 0 0 0-2 2c0 9 7 16 16 16a2 2 0 0 0 2-2v-3l-5-2-2 3c-4-2-5-3-7-7l3-2-2-5Z"/>'};
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.message}</svg>`;
}
