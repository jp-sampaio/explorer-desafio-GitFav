import { GithubSearch } from "./GithubSearch.js";

class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || [];
    GithubSearch.search("jp-sampaio");
  }

  save() {
    localStorage.setItem("@github-favorites", JSON.stringify(this.entries));
  }
  
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("tbody");
    this.update();
  }

  update() {
    this.removeTrAll();

    this.entries.forEach( user => {
      const row = this.createRow();

      row.querySelector("img").src = `https://github.com/${user.login}.png`;
      row.querySelector("img").alt = `${user.name}`;
    })
    
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="user">
        <img src="" alt="Username" class="" />
        <a href="">
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

  removeTrAll() {
    this.tbody.querySelectorAll("tr .hide")
    .forEach((tr) => {
      tr.remove();
    });
  }
}