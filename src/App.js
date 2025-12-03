import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PlusCircle, Edit2, Trash2, X, DollarSign, Calendar, Tag, FileText, RefreshCw } from 'lucide-react';

const API_URL = 'https://ajii.my.id';

const FinanceTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    income: ['Gaji', 'Freelance', 'Investasi', 'Hadiah', 'Lainnya'],
    expense: ['Makanan', 'Transport', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Lainnya']
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/read.php?filter=${filter}`);
      const result = await response.json();
      if (result.success) {
        setTransactions(result.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Gagal memuat data. Pastikan backend sudah berjalan!');
    }
    setLoading(false);
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats.php`);
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, [filter]);

  // Create or Update transaction
  const handleSubmit = async () => {
    if (!formData.amount || !formData.category || !formData.description || !formData.date) {
      alert('Semua field harus diisi!');
      return;
    }

    setLoading(true);
    const url = editingId ? `${API_URL}/update.php` : `${API_URL}/create.php`;
    const data = editingId ? { ...formData, id: editingId } : formData;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(editingId ? 'Transaksi berhasil diupdate!' : 'Transaksi berhasil ditambahkan!');
        setShowModal(false);
        setEditingId(null);
        setFormData({
          type: 'income',
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchTransactions();
        fetchStats();
      } else {
        alert('Gagal menyimpan: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Terjadi kesalahan saat menyimpan data!');
    }
    setLoading(false);
  };

  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Transaksi berhasil dihapus!');
        fetchTransactions();
        fetchStats();
      } else {
        alert('Gagal menghapus: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Terjadi kesalahan saat menghapus data!');
    }
    setLoading(false);
  };

  const handleEdit = (transaction) => {
    setFormData(transaction);
    setEditingId(transaction.id);
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-3 rounded-xl">
                <Wallet className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Finance Tracker</h1>
                <p className="text-gray-500">Dengan Backend PHP + MySQL</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  fetchTransactions();
                  fetchStats();
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl flex items-center gap-2 transition-all"
                disabled={loading}
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button
                onClick={() => {
                  setShowModal(true);
                  setEditingId(null);
                  setFormData({
                    type: 'income',
                    amount: '',
                    category: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <PlusCircle size={20} />
                Tambah
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-100">Pemasukan</span>
                <TrendingUp size={24} />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(stats.income)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-100">Pengeluaran</span>
                <TrendingDown size={24} />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(stats.expense)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-indigo-100">Saldo</span>
                <DollarSign size={24} />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(stats.balance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilter('income')}
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'income' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setFilter('expense')}
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw size={40} className="animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Belum ada transaksi</p>
              <p className="text-gray-400">Klik tombol "Tambah" untuk memulai</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="text-green-600" size={24} />
                      ) : (
                        <TrendingDown className="text-red-600" size={24} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{transaction.category}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`text-xl font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        disabled={loading}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        disabled={loading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Transaksi</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                    className={`p-3 rounded-lg border-2 transition-all ${formData.type === 'income' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <TrendingUp className="mx-auto mb-1" size={24} />
                    Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                    className={`p-3 rounded-lg border-2 transition-all ${formData.type === 'expense' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <TrendingDown className="mx-auto mb-1" size={24} />
                    Pengeluaran
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    Jumlah (IDR)
                  </div>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Masukkan jumlah"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    Kategori
                  </div>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Pilih Kategori</option>
                  {categories[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    Deskripsi
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Contoh: Gaji bulan Januari"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Tanggal
                  </div>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceTracker;
