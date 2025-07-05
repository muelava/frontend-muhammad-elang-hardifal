import { useState, useEffect } from "react";
import { Globe, Anchor, Package, Calculator } from "lucide-react";
import AutoComplete from "@/components/Autocomplete";
import { apiService } from "@/services/apiServices";
import type { Negara, Pelabuhan, Barang, FormData } from "@/types";

const FormCard = () => {
  const [negaras, setNegaras] = useState<Negara[]>([]);
  const [pelabuhans, setPelabuhans] = useState<Pelabuhan[]>([]);
  const [barangs, setBarangs] = useState<Barang[]>([]);

  const [formData, setFormData] = useState<FormData>({
    negara: null,
    pelabuhan: null,
    barang: null,
    discount: 0,
    harga: 0,
    total: 0,
  });

  const [loading, setLoading] = useState({
    negaras: false,
    pelabuhans: false,
    barangs: false,
  });

  // Load countries on component mount
  useEffect(() => {
    loadNegaras();
  }, []);

  // Load ports when country changes
  useEffect(() => {
    if (formData.negara) {
      loadPelabuhans(formData.negara.id_negara);
      // Reset pelabuhan and barang when country changes
      setFormData((prev) => ({
        ...prev,
        pelabuhan: null,
        barang: null,
        discount: 0,
        harga: 0,
        total: 0,
      }));
    } else {
      setPelabuhans([]);
    }
  }, [formData.negara]);

  // Load goods when port changes
  useEffect(() => {
    if (formData.pelabuhan) {
      loadBarangs(formData.pelabuhan.id_negara);
      // Reset barang when port changes
      setFormData((prev) => ({
        ...prev,
        barang: null,
        discount: 0,
        harga: 0,
        total: 0,
      }));
    } else {
      setBarangs([]);
    }
  }, [formData.pelabuhan]);

  // Update discount and price when goods change
  useEffect(() => {
    if (formData.barang) {
      const newDiscount = formData.barang.diskon || 0;
      const newHarga = formData.barang.harga || 0;
      const newTotal = newHarga * (newDiscount / 100);

      setFormData((prev) => ({
        ...prev,
        discount: newDiscount,
        harga: newHarga,
        total: newTotal,
      }));
    }
  }, [formData.barang]);

  const loadNegaras = async () => {
    setLoading((prev) => ({ ...prev, negaras: true }));
    try {
      const data = await apiService.getNegaras();
      setNegaras(data);
    } catch (error) {
      console.error("Failed to load negaras:", error);
    } finally {
      setLoading((prev) => ({ ...prev, negaras: false }));
    }
  };

  const loadPelabuhans = async (idNegara: number) => {
    setLoading((prev) => ({ ...prev, pelabuhans: true }));
    try {
      const data = await apiService.getPelabuhans(idNegara);
      setPelabuhans(data);
    } catch (error) {
      console.error("Failed to load pelabuhans:", error);
    } finally {
      setLoading((prev) => ({ ...prev, pelabuhans: false }));
    }
  };

  const loadBarangs = async (idPelabuhan: number) => {
    setLoading((prev) => ({ ...prev, barangs: true }));
    try {
      const data = await apiService.getBarangs(idPelabuhan);
      setBarangs(data);
    } catch (error) {
      console.error("Failed to load barangs:", error);
    } finally {
      setLoading((prev) => ({ ...prev, barangs: false }));
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleReset = () => {
    setFormData({
      negara: null,
      pelabuhan: null,
      barang: null,
      discount: 0,
      harga: 0,
      total: 0,
    });
    setPelabuhans([]);
    setBarangs([]);
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="space-y-6">
        {/* Negara */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Globe className="h-4 w-4 mr-2" />
            Negara
          </label>
          <AutoComplete
            options={negaras}
            value={formData.negara}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, negara: value }))
            }
            placeholder="Pilih negara..."
            displayField="nama_negara"
            loading={loading.negaras}
          />
        </div>

        {/* Pelabuhan */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Anchor className="h-4 w-4 mr-2" />
            Pelabuhan
          </label>
          <AutoComplete
            options={pelabuhans}
            value={formData.pelabuhan}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, pelabuhan: value }))
            }
            placeholder="Pilih pelabuhan..."
            displayField="nama_pelabuhan"
            loading={loading.pelabuhans}
            disabled={!formData.negara}
          />
        </div>

        {/* Barang */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Package className="h-4 w-4 mr-2" />
            Barang
          </label>
          <AutoComplete
            options={barangs}
            value={formData.barang}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, barang: value }))
            }
            placeholder="Pilih barang..."
            displayField="nama_barang"
            loading={loading.barangs}
            disabled={!formData.pelabuhan}
          />
        </div>

        {/* Description */}
        {formData.barang && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Deskripsi Barang
            </label>
            <textarea
              value={formData.barang.description || ""}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Discount */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Discount (%)
          </label>
          <input
            type="number"
            value={formData.discount}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        {/* Harga */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Harga
          </label>
          <input
            type="text"
            value={formatCurrency(formData.harga)}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        {/* Total */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calculator className="h-4 w-4 mr-2" />
            Total
          </label>
          <input
            type="text"
            value={formatCurrency(formData.total)}
            readOnly
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg bg-blue-50 text-blue-800 font-semibold text-lg"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleReset}
            className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200 font-medium cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormCard;
