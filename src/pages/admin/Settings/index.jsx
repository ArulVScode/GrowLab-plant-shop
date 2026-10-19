import { useEffect, useState } from "react";
import { User, Lock, Store, CreditCard } from "lucide-react";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { useToast } from "../../../components/common/Toast";
import { Input } from "../../../components/common/Input";
import { MainImageUpload } from "../../../components/admin/ImageUpload";
import {
  getPaymentSettings,
  updatePaymentSettings,
} from "../../../services/settingsService";
import Button from "../../../components/common/Button";

const EMPTY_PAYMENT = {
  bank: { name: "", accountNumber: "", accountName: "" },
  va: { bank: "", number: "" },
  ewallet: { provider: "", number: "", accountName: "", qrisUrl: "" },
};

export default function AdminSettings() {
  const { admin, updateProfile, changePassword } = useAdminAuth();
  const { showToast } = useToast();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-xl md:text-2xl">Settings</h2>
        <p className="text-muted text-sm mt-1">
          Kelola profil admin dan informasi toko GrowLab
        </p>
      </div>

      <ProfileSection
        admin={admin}
        updateProfile={updateProfile}
        showToast={showToast}
      />
      <PasswordSection changePassword={changePassword} showToast={showToast} />
      <StoreSection showToast={showToast} />
      <PaymentSection showToast={showToast} />
    </div>
  );
}

function ProfileSection({ admin, updateProfile, showToast }) {
  const [name, setName] = useState(admin?.name || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    await updateProfile({ name, email });
    setSaving(false);
    showToast("Profile updated successfully.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="nb-surface p-5 flex flex-col gap-4"
    >
      <h3 className="flex items-center gap-2 font-display font-bold text-base">
        <User size={18} /> Profile Settings
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="settings-name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          id="settings-email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
      </div>
      <Button
        variant="primary"
        type="submit"
        className="self-start"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}

function PasswordSection({ changePassword, showToast }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.current) newErrors.current = "Current password is required.";
    if (!form.next || form.next.length < 6)
      newErrors.next = "New password must be at least 6 characters.";
    if (form.confirm !== form.next)
      newErrors.confirm = "Password confirmation doesn't match.";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      await changePassword({
        currentPassword: form.current,
        newPassword: form.next,
      });
      showToast("Password changed successfully.");
      setForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      setErrors({ current: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="nb-surface p-5 flex flex-col gap-4"
    >
      <h3 className="flex items-center gap-2 font-display font-bold text-base">
        <Lock size={18} /> Change Password
      </h3>
      <Input
        id="current-password"
        type="password"
        label="Current Password"
        value={form.current}
        onChange={(e) => setField("current", e.target.value)}
        error={errors.current}
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="new-password"
          type="password"
          label="New Password"
          value={form.next}
          onChange={(e) => setField("next", e.target.value)}
          error={errors.next}
        />
        <Input
          id="confirm-password"
          type="password"
          label="Confirm New Password"
          value={form.confirm}
          onChange={(e) => setField("confirm", e.target.value)}
          error={errors.confirm}
        />
      </div>
      <Button
        variant="primary"
        type="submit"
        className="self-start"
        disabled={saving}
      >
        {saving ? "Saving..." : "Change Password"}
      </Button>
    </form>
  );
}

function StoreSection({ showToast }) {
  const [store, setStore] = useState({
    name: "GrowLab",
    email: "hello@growlab.test",
    phone: "021-5555-0199",
    address: "Jl. Kenanga No. 12, Cikupa, Tangerang, Banten",
  });
  const [saving, setSaving] = useState(false);

  const setField = (field, value) =>
    setStore((s) => ({ ...s, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    showToast("Store settings updated successfully.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="nb-surface p-5 flex flex-col gap-4"
    >
      <div>
        <h3 className="flex items-center gap-2 font-display font-bold text-base">
          <Store size={18} /> Store Settings
        </h3>
        <p className="text-xs text-muted mt-1">
          Info ini ditampilkan di halaman publik (footer, kontak). Masih mock —
          belum terhubung ke halaman public.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          id="store-name"
          label="Store Name"
          value={store.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        <Input
          id="store-email"
          type="email"
          label="Store Email"
          value={store.email}
          onChange={(e) => setField("email", e.target.value)}
        />
        <Input
          id="store-phone"
          label="Store Phone"
          value={store.phone}
          onChange={(e) => setField("phone", e.target.value)}
        />
        <Input
          id="store-address"
          label="Store Address"
          value={store.address}
          onChange={(e) => setField("address", e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        type="submit"
        className="self-start"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Store Settings"}
      </Button>
    </form>
  );
}

function PaymentSection({ showToast }) {
  const [form, setForm] = useState(EMPTY_PAYMENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPaymentSettings()
      .then(setForm)
      .catch(() => showToast("Gagal memuat pengaturan pembayaran."))
      .finally(() => setLoading(false));
  }, []);

  const setField = (group, field, value) =>
    setForm((f) => ({ ...f, [group]: { ...f[group], [field]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      setForm(await updatePaymentSettings(form));
      showToast("Pengaturan pembayaran disimpan.");
    } catch (err) {
      showToast(err.message || "Gagal menyimpan pengaturan pembayaran.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="nb-surface p-5 flex flex-col gap-5"
    >
      <div>
        <h3 className="flex items-center gap-2 font-display font-bold text-base">
          <CreditCard size={18} /> Payment Settings
        </h3>
        <p className="text-xs text-muted mt-1">
          Ditampilkan ke pelanggan setelah checkout sesuai metode yang dipilih.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <p className="sm:col-span-2 font-display font-bold text-sm">
          Transfer Bank
        </p>
        <Input
          id="bank-name"
          label="Nama Bank"
          value={form.bank.name}
          onChange={(e) => setField("bank", "name", e.target.value)}
        />
        <Input
          id="bank-number"
          label="Nomor Rekening"
          value={form.bank.accountNumber}
          onChange={(e) => setField("bank", "accountNumber", e.target.value)}
        />
        <Input
          id="bank-holder"
          label="Atas Nama"
          value={form.bank.accountName}
          onChange={(e) => setField("bank", "accountName", e.target.value)}
        />

        <p className="sm:col-span-2 font-display font-bold text-sm mt-2">
          Virtual Account
        </p>
        <Input
          id="va-bank"
          label="Bank VA"
          value={form.va.bank}
          onChange={(e) => setField("va", "bank", e.target.value)}
        />
        <Input
          id="va-number"
          label="Nomor VA"
          value={form.va.number}
          onChange={(e) => setField("va", "number", e.target.value)}
        />

        <p className="sm:col-span-2 font-display font-bold text-sm mt-2">
          E-Wallet
        </p>
        <Input
          id="ew-provider"
          label="Nama E-Wallet (OVO/GoPay/Dana)"
          value={form.ewallet.provider}
          onChange={(e) => setField("ewallet", "provider", e.target.value)}
        />
        <Input
          id="ew-number"
          label="Nomor E-Wallet"
          value={form.ewallet.number}
          onChange={(e) => setField("ewallet", "number", e.target.value)}
        />
        <Input
          id="ew-holder"
          label="Atas Nama"
          value={form.ewallet.accountName}
          onChange={(e) => setField("ewallet", "accountName", e.target.value)}
        />
      </div>

      <MainImageUpload
        label="QRIS (opsional)"
        required={false}
        value={form.ewallet.qrisUrl}
        onChange={(url) => setField("ewallet", "qrisUrl", url)}
      />

      <Button
        variant="outline"
        type="submit"
        className="self-start"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Payment Settings"}
      </Button>
    </form>
  );
}
