export class Evaluation {
  score: number;
  errors: any;
  tot: any;
  A: number;
  AA: number;
  AAA: number;
  evaluationDate: Date;

  constructor(score: number, errors: any, tot: any, A: number, AA: number, AAA: number, evaluationDate: Date) {
    this.score = score;
    this.errors = JSON.parse(atob(errors));
    this.tot = JSON.parse(atob(tot));
    this.A = A;
    this.AA = AA;
    this.AAA = AAA;
    this.evaluationDate = evaluationDate;
  }
}
