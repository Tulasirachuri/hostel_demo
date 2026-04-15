import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CreditCard, Receipt } from 'lucide-react';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bills');
      setBills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const payBill = async (billId, receiptFile) => {
    try {
      const formData = new FormData();
      formData.append('billId', billId);
      formData.append('receipt', receiptFile);

      await axios.post('http://localhost:5000/api/bills/pay', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchBills(); // refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to submit payment. Please ensure you uploaded a valid receipt image.');
    }
  };

  if(loading) return <div className="min-h-screen bg-slate-900 flex justify-center items-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Financial Dues</h1>
            <p className="text-slate-400">View and seamlessly pay your pending bills.</p>
          </div>
        </div>

        <div className="glass rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden shadow-2xl">
          {bills.length === 0 ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center">
              <Receipt size={48} className="opacity-20 mb-4" />
              <p>No bills found!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-slate-400 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Month</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Room Rent</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {bills.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/70 transition">
                      <td className="px-6 py-4 font-medium">{b.month}</td>
                      <td className="px-6 py-4 text-slate-300">₹{b.amount}</td>
                      <td className="px-6 py-4 text-slate-300">₹{b.room_rent}</td>
                      <td className="px-6 py-4 text-white font-bold tracking-wider">₹{b.total}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${b.status === 'paid' || b.status === 'verified' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/20 text-amber-500'}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {b.status === 'pending' && (
                          <div className="flex flex-col gap-2 items-end">
                            <input 
                              type="file" 
                              id={`upload-${b.id}`} 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  payBill(b.id, e.target.files[0]);
                                }
                              }}
                            />
                            <label 
                              htmlFor={`upload-${b.id}`}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                            >
                              Upload Receipt & Pay
                            </label>
                          </div>
                        )}
                        {b.status === 'paid' && (
                          <span className="text-slate-400 text-xs italic">Verification pending...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bills;
