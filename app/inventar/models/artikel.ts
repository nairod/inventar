export class Artikel {
  constructor(
    public _id: string,
    public name: string,
    public kategorie: string,
    public einstandspreis: number,
    public verkaufspreis: number,
    public imagePath: string) { }
}
