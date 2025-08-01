// classes.js
export class Cliente {
  constructor(nome, email, id = null) {
    this.nome = nome;
    this.email = email;
    this._id = id;
  }

  static fromJson(json) {
    return new Cliente(json.nome, json.email, json._id);
  }
}
