import { GithubSearch } from "./GithubSearch.js";

class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(userName) {
    try {
      const userExists = this.entries.find( entry => entry.login === userName);

      if(userExists) {
        throw new Error("O usuário já foi cadastrado!");
      }

      const user = await GithubSearch.search(userName);

      if(user.login === undefined) {
        throw new Error("O usuário não foi encontrado!");
      }

      this.entries = [user, ...this.entries];
      this.save();
      this.update();

    } catch(error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter( entry => entry.login !== user.login);
    
    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tBody = this.root.querySelector("tbody");
    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".favoritar");
    addButton.onclick = () => {
      const { value } = this.root.querySelector("#user-name");
      
      this.add(value)
    }
  }

  update() {
    this.removeAllTr();

    this.empyt();

    this.entries.forEach( user => {
      const row = this.createRow();

      row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector("a").href = `https://github.com/${user.login}`;
      row.querySelector("a .name").textContent = user.name;
      row.querySelector("a .username").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja excluir esse usuário");

        if(isOk) {
          this.delete(user);
        }
      } 

      this.tBody.append(row);
    });
  }

  empyt() {
    if(this.entries.length == 0) {
      const empytRow = document.createElement("tr");
      empytRow.classList.add("empty");

      empytRow.innerHTML = `
        <td class="td-enpty">  
            <img src="./assets/Estrela.svg" alt="Estrela" />
            <p>Nenhum favorito ainda</p>
          </td>
      `;

      this.tBody.append(empytRow);
    }
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="user">
        <img src="" alt="Username" class="profile" />
        <a href="" target="_blank">
          <p class="name"></p>
          <span class="username"></span>
        </a>
      </td>
      <td class="repositories"></td>
      <td class="followers"></td>
      <td>
        <button class="remove">Remove</button>
      </td>
    `;

    return tr;
  }

  removeAllTr() {
    this.tBody.querySelectorAll("tr")
    .forEach((tr) => {
      tr.remove();
    });
  }
}