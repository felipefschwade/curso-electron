import { ipcRenderer, shell } from "electron";

const linkFechar: Element = document.querySelector("#link-fechar");

linkFechar.addEventListener("click", () => {
  ipcRenderer.send('fechar-janela-sobre');
});

const spanVersaoElectron = document.querySelector('#versao-electron');

window.onload = () => {
  spanVersaoElectron.textContent = process.versions.electron;
};

const linkGitHub = document.querySelector('#link-github');

linkGitHub.addEventListener('click', () => {
  shell.openExternal('https://github.com/felipefschwade');
});
