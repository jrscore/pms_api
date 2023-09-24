import mongoose from 'mongoose';
import { Monit, PV, monitModel } from './monit_model';



export class MonitRepository {

	// 현재 데이터를 받아서 저장한다
	async save(mnt: Monit): Promise<any> {
		try {
			const newdoc = await monitModel.create(mnt);
		} catch (error) {
			console.error('monit repo - save error', error);
		}
	}

	// // 특정사이트 최신 데이터를 받아온다
	// async getCurrent(): Promise<any> {
	// 	try {
	// 		const json = await monitModel.findOne().sort({ _id: -1 }).exec();
	// 		if (json) {
	// 			return json;
	// 		} else {
	// 			throw new Error('REPO: Document not found');
	// 		}
	// 	} catch (error) {
	// 		throw new Error('REPO: Server Error');
	// 	}
	// }

	// 최신 데이터를 받아온다
	async getByCorp(corp:string): Promise<Monit[]> {
		try {
			
			const monit_arr = await monitModel.find({ corp: corp }).sort({ _id: -1 })
			if (monit_arr) {
				return monit_arr;
			} else {
				throw new Error('REPO: Document not found');
			}
		} catch (error) {
			throw new Error('REPO: Server Error');
		}
	}


	// 일자를 인수로 받아서 해당일자의 맨 마지막 데이터를 받아온다
	async getDay(date: Date): Promise<any> {
		try {
			// 해당 일자 시작과 끝을 설정
			const start = new Date(date).setHours(0, 0, 0, 0)
			const end = new Date(date).setHours(23, 59, 59, 999);

			const json = await monitModel.findOne({
				date: {
					$gte: start,
					$lte: end
				}
			}).sort({ _id: -1 }).exec();

			if (json) {
				return json;
			} else {
				throw new Error('Document not found');
			}
		} catch (error) {
			throw new Error('Server Error');
		}
	}

	// 월을 인수로 받아서 해당월의 매일의 맨 마지막 데이터를 받아온다
	async getMonth(year: number, month: number): Promise<any[]> {
		try {
			const mth_stt = new Date(year, month, 1);
			const mth_end = new Date(year, month + 1, 0, 23, 59, 59, 999);
			const results = [];

			for (let day = mth_stt; day <= mth_end; day.setDate(day.getDate() + 1)) {
				const data = await this.getDay(day);
				if (data) {
					results.push(data);
				}
			}

			if (results.length > 0) {
				return results;
			} else {
				throw new Error('Documents not found for the given month');
			}
		} catch (error) {
			throw new Error('Server Error');
		}
	}

}
