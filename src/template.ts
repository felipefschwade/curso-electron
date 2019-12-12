import { App, ipcMain, MenuItem } from 'electron';
import data from './data';

export default class TemplateGenerator {

  private static template: object[] = [];

  public static geraMenuPrincipal(app: App): object[] {
    const templateMenu = [
      new MenuItem(
        {
          label: 'Sobre',
          submenu: [
            {
              label: 'Sobre o Alura Timer',
              click: () => {
                ipcMain.emit('abrir-janela-sobre');
              },
              accelerator: 'CmdOrCtrl+I',
            },
          ],
        },
      ),
      {
        label: 'View',
        submenu: [{
            role: 'reload',
          },
          {
            role: 'toggledevtools',
          },
        ],
      },
      {
        label: 'Window',
        submenu: [
          {
            role: 'minimize',
            accelerator: 'CmdOrCtrl+M',
          },
          {
            role: 'close',
          },
        ],
      },
    ];
    return templateMenu;
  }

  public static adicionaCursoAoTray(curso: any, window: Electron.BrowserWindow) {
    const menuItem = {
      label: curso,
      type: 'radio',
      checked: true,
      click: () => {
        window.webContents.send('curso-trocado', curso);
      },
    };
    this.template.push(menuItem);
    return this.template;
  }
  public static geraTemplate(window: Electron.BrowserWindow): object[] {
    this.template = [
      {
        label: 'Cursos',
      },
      {
        label: '',
        type: 'separator',
      },
    ];
    const cursos = data.pegaNomeDosCursos();
    cursos.forEach((c) => {
      const menuItem = {
        label: c,
        type: 'radio',
        click: () => {
          window.webContents.send('curso-trocado', c);
        },
      };
      this.template.push(menuItem);
    });
    return this.template;
  }
}
