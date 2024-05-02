import { Rule, SchematicContext, Tree, apply, chain, externalSchematic, mergeWith, move, template, url } from '@angular-devkit/schematics';


interface SchemaOptions {
  name: string;
}

export function main(_options: SchemaOptions): Rule {
  return (_: Tree, _context: SchematicContext) => {
    const rules: Rule[] = [
      createFolders(_options),
      createAssetsFolder(),
      updateAppComponentTemplate(_options),
      modifyAppConfig(_options),
      setupAngularMaterial(),
    ];

    return chain(rules);
  };
}

function createFolders(_options: SchemaOptions) {
  return (_: Tree, _context: SchematicContext) => {
    /* const core = apply(url("./app"), [move(`${name}/src/app`)]);
    return mergeWith(core); */
    const sourceTemplates = apply(url('./app'), [
      template({ ..._options }),  // Processar substituições de variáveis nos templates
      move('src/app')             // Destino dos arquivos no projeto
    ]);
    return mergeWith(sourceTemplates);
  };
} 

function createAssetsFolder() {
  return (_: Tree, _context: SchematicContext) => {
    const views = apply(url("./config/assets"), [move(`src/assets`)]);
    return mergeWith(views);
  };
}

function setupAngularMaterial(): Rule {
  return externalSchematic('@angular/material', 'ng-add', {
    // opções podem ser especificadas aqui, como tema a ser usado
    theme: 'indigo-pink',
    typography: true,
    animations: 'true',
  });
}

function updateAppComponentTemplate(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const filePath = '/src/app/app.component.html';
    const content = tree.read(filePath);
    if (content) {
      //const contentAsString = content.toString('utf-8');
      const modifiedContent = modifyHtmlContent(/* contentAsString, _options */);
      tree.overwrite(filePath, modifiedContent);
    }
    return tree;
  };
}

function modifyHtmlContent(/* originalContent: string, _options: any */): string {
  // Modifique o HTML aqui conforme necessário
  // Exemplo: Adicionando uma mensagem de boas-vindas
  return `<router-outlet />`;
}

export function modifyAppConfig(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const filePath = '/src/app/app.config.ts'; // Caminho correto do arquivo
    const content = tree.read(filePath);

    if (content) {
      /* _context.logger.error(`File ${filePath} not found.`);
      return tree; */
      //const contentAsString = content.toString('utf-8');
      const modifiedContent = modifyContent();
      tree.overwrite(filePath, modifiedContent);
    }
    return tree;
  };
}

function modifyContent(): string {
  console.log('testeeeeee')
  // Aqui você pode adicionar a lógica para modificar o conteúdo do arquivo
  //const lines = content.split('\n');
  const newLines = `import { LocationStrategy, HashLocationStrategy } from '@angular/common';
  import { provideHttpClient } from '@angular/common/http';
  import { ApplicationConfig, importProvidersFrom, LOCALE_ID, APP_INITIALIZER,} from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
  import { provideRouter } from '@angular/router';
  import { routes } from './app.routes';
  import { AppConfigService } from './core/services/app-config.service';
  
  export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(routes),
      provideHttpClient(/* withInterceptors([requestInterceptor]) */),
      importProvidersFrom(BrowserModule),
      { provide: LOCALE_ID, useValue: 'pt-BR', multi: true },
      { provide: LocationStrategy, useClass: HashLocationStrategy },
      {
        provide: APP_INITIALIZER,
        multi: true,
        deps: [AppConfigService],
        useFactory: (appConfigService: AppConfigService) => async () => {
          await Promise.all([appConfigService.getConfig]);
        },
      }
    ],
  };
  `;
  return newLines;
}
