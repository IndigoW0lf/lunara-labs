// Standalone prototype entry retained during the staged React conversion.
import {mountLegacyActivities} from './activity-controller.mjs';
mountLegacyActivities(document.querySelector('#main'));
document.querySelector('#privacy-button').addEventListener('click',()=>document.querySelector('#privacy').showModal());
document.querySelectorAll('.close-dialog,.close-privacy').forEach(button=>button.addEventListener('click',()=>document.querySelector('#privacy').close()));
