import { Artikel } from '../models/artikel';
import * as _ from 'lodash';
export class Kategorie {
  readonly totalEP: number;
  readonly totalVP: number;
  readonly totalCount: number;
  readonly chunks: Artikel[][];
  constructor(
    public name: string,
    public artikelliste: Artikel[]) {
    this.totalEP = _.sumBy(artikelliste, a => a.einstandspreis);
    this.totalVP = _.sumBy(artikelliste, a => a.verkaufspreis);
    this.chunks = _.chunk(artikelliste, 4);
    this.totalCount = artikelliste.length;
  }
}

