import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './TicTacToeWebPart.module.scss';
import * as strings from 'TicTacToeWebPartStrings';

// Interface pour définir les propriétés du composant
export interface ITicTacToeWebPartProps {
  description: string;
}

export default class TicTacToeWebPart extends BaseClientSideWebPart<ITicTacToeWebPartProps> {

  private currentPlayer: string;
  private gameBoard: string[][];

  // Fonction de rendu du composant
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.ticTacToe}">
        <div class="${styles.container}">
          <div class="${styles.row}">
            <div class="${styles.column}">
              <span class="${styles.title}">Morpion</span>
              <p class="${styles.description}">${escape(this.properties.description)}</p>
              <div class="${styles.board}">
                ${this.renderBoard()} <!-- Appel à la fonction de rendu du plateau de jeu -->
              </div>
              <div>
                <button class="${styles.button}" id="resetButton">Recommencer</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    this.addResetButtonHandler(); // Ajout du gestionnaire d'événement pour le bouton Reset
    this.initializeGame(); // Initialisation du jeu
  }

  // Fonction pour générer le HTML du plateau de jeu
  private renderBoard(): string {
    let boardHTML = '';
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        boardHTML += `<div class="${styles.cell}" id="cell_${row}_${col}"></div>`;
      }
    }
    return boardHTML;
  }

  // Ajout du gestionnaire d'événement pour le bouton Reset
  private addResetButtonHandler(): void {
    const resetButton = this.domElement.querySelector('#resetButton');
    resetButton.addEventListener('click', () => {
      this.initializeGame();
    });
  }

  // Initialisation du jeu
  private initializeGame(): void {
    this.currentPlayer = 'X';
    this.gameBoard = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.clearBoard(); // Effacement du plateau de jeu
    this.addClickHandlers(); // Ajout des gestionnaires d'événement pour les cellules
  }

  // Effacement du plateau de jeu
  private clearBoard(): void {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cell = this.domElement.querySelector(`#cell_${row}_${col}`);
        cell.textContent = '';
      }
    }
  }

  // Ajout des gestionnaires d'événement pour les cellules
  private addClickHandlers(): void {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cell = this.domElement.querySelector(`#cell_${row}_${col}`);
        cell.addEventListener('click', () => {
          this.handleCellClick(row, col); // Appel de la fonction de gestion du clic sur une cellule
        });
      }
    }
  }

  // Gestion du clic sur une cellule
  private handleCellClick(row: number, col: number): void {
    if (this.gameBoard[row][col] === '') {
      this.gameBoard[row][col] = this.currentPlayer;
      const cell = this.domElement.querySelector(`#cell_${row}_${col}`);
      cell.textContent = this.currentPlayer;
      if (this.checkWin()) {
        alert(`${this.currentPlayer} gagne la partie !`); // Vérification de la victoire
        this.initializeGame(); // Réinitialisation du jeu après la victoire
      } else if (this.checkTie()) {
        alert('Egalité !'); // Vérification de l'égalité
        this.initializeGame(); // Réinitialisation du jeu après l'égalité
      } else {
        this.currentPlayer = (this.currentPlayer === 'X') ? 'O' : 'X'; // Changement de joueur
      }
    }
  }

  // Vérification des conditions de victoire
  private checkWin(): boolean {
    // Vérification des lignes
    for (let row = 0; row < 3; row++) {
      if (this.gameBoard[row][0] !== '' && this.gameBoard[row][0] === this.gameBoard[row][1] && this.gameBoard[row][1] === this.gameBoard[row][2]) {
        return true;
      }
    }

    // Vérification des colonnes
    for (let col = 0; col < 3; col++) {
      if (this.gameBoard[0][col] !== '' && this.gameBoard[0][col] === this.gameBoard[1][col] && this.gameBoard[1][col] === this.gameBoard[2][col]) {
        return true;
      }
    }

    // Vérification des diagonales
    if (this.gameBoard[0][0] !== '' && this.gameBoard[0][0] === this.gameBoard[1][1] && this.gameBoard[1][1] === this.gameBoard[2][2]) {
      return true;
    }
    if (this.gameBoard[0][2] !== '' && this.gameBoard[0][2] === this.gameBoard[1][1] && this.gameBoard[1][1] === this.gameBoard[2][0]) {
      return true;
    }

    return false;
  }

  // Vérification de l'égalité
  private checkTie(): boolean {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.gameBoard[row][col] === '') {
          return false;
        }
      }
    }
    return true;
  }

  // Version du composant
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  // Configuration du volet de propriétés
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
