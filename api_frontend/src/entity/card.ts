export class CardDao {
  constructor(
    public issuer: string,
    public cdno: number,
    public date: Date,
    public store: string,
    public amount: number
  ) {}

  toJson() {
    return {
      issuer: this.issuer,
      cdno: this.cdno,
      date: this.date,
      store: this.store,
      amount: this.amount,
    }
  }

  static fromSnap(snapshot: FirebaseFirestore.DocumentSnapshot) {
    const data = snapshot.data()
    return new CardDao(
      data?.issuer,							//
      data?.cdno,								//
      data?.date.toDate(),			//
      data?.store,							//
      data?.amount							//
    )
  }
}
