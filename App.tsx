import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  Save, 
  Calendar, 
  Download,
  Pencil,
  CheckCircle,
  AlertCircle,
  Truck,
  UserCog,
  Upload,
  Settings,
  ClipboardCopy,
  MapPin,
  User,
  Phone,
  Clock,
  CreditCard,
  Calendar as CalendarIcon,
  Trash2,
  FileSpreadsheet,
  FilePenLine,
  Mail,
  FilterX
} from 'lucide-react';

import { PREDEFINED_LOCATIONS, YEARS, CURRENT_YEAR, MONTHS } from './constants.ts';
import { Record, FormDataState, SubmitStatus, SortOrder } from './types.ts';
import TableSection from './components/TableSection.tsx';
import ConfirmationModal from './components/ConfirmationModal.tsx';
import WelcomeBanner from './components/WelcomeBanner.tsx';

declare global {
  interface Window {
    XLSX: any;
  }
}

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const demoRecords: Record[] = [
    // Visitors
    { id: 'demo_v1', type: 'visitor', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[0], name: 'أحمد محمد', phone: '0501234567', department: 'الإدارة المالية', purpose: 'اجتماع عمل', date: `${CURRENT_YEAR}-05-21`, timeIn: '09:15', timeOut: '10:30', idType: 'الهوية الوطنية', notes: 'اجتماع بخصوص الميزانية', createdAt: new Date() },
    { id: 'demo_v2', type: 'visitor', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[2], name: 'فاطمة علي', phone: '0567654321', department: 'الموارد البشرية', purpose: 'مقابلة وظيفية', date: `${CURRENT_YEAR}-05-22`, timeIn: '11:00', timeOut: '11:45', idType: 'جواز سفر', notes: 'مرشحة لوظيفة مصمم', createdAt: new Date() },
    { id: 'demo_v3', type: 'visitor', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[1], name: 'يوسف حسن', phone: '0551122334', department: 'الشؤون القانونية', purpose: 'تسليم مستندات', date: `${CURRENT_YEAR}-05-22`, timeIn: '14:00', timeOut: '14:10', idType: 'رخصة قيادة', notes: '', createdAt: new Date() },
    { id: 'demo_v4', type: 'visitor', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[0], name: 'سارة خالد', phone: '0523344556', department: 'الموارد البشرية', purpose: 'زيارة', date: `${CURRENT_YEAR}-05-23`, timeIn: '10:00', timeOut: '', idType: 'الهوية الوطنية', notes: 'استفسار عن خدمات الموظفين', createdAt: new Date() },
    // Suppliers
    { id: 'demo_s1', type: 'supplier', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[0], name: 'شركة النور للتوريدات (مندوب: علي)', phone: '0509876543', department: 'قسم المشتريات', purpose: 'توريد أجهزة مكتبية', date: `${CURRENT_YEAR}-05-21`, timeIn: '10:00', timeOut: '10:20', idType: 'بطاقة عمل', notes: 'توريد عدد 5 طابعات', createdAt: new Date() },
    { id: 'demo_s2', type: 'supplier', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[2], name: 'مطبعة المستقبل (مندوب: هدى)', phone: '0561237890', department: 'قسم التسويق', purpose: 'تسليم مطبوعات', date: `${CURRENT_YEAR}-05-21`, timeIn: '15:30', timeOut: '15:45', idType: 'بطاقة عمل', notes: 'بروشورات و بطاقات عمل', createdAt: new Date() },
    { id: 'demo_s3', type: 'supplier', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[1], name: 'خدمات الصيانة السريعة (فني: عمر)', phone: '0558765432', department: 'قسم الصيانة', purpose: 'صيانة دورية', date: `${CURRENT_YEAR}-05-22`, timeIn: '09:00', timeOut: '11:00', idType: 'بطاقة عمل', notes: 'صيانة وحدات التكييف', createdAt: new Date() },
    { id: 'demo_s4', type: 'supplier', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[3], name: 'مورد أغذية (مندوب: ليلى)', phone: '0523456789', department: 'الكافتيريا', purpose: 'توصيل طلبية', date: `${CURRENT_YEAR}-05-23`, timeIn: '08:30', timeOut: '08:45', idType: 'أخرى', notes: '', createdAt: new Date() },
    // Employees
    { id: 'demo_e1', type: 'employee', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[0], name: 'عبدالله سالم', phone: '', department: 'تقنية المعلومات', purpose: 'نسيان بطاقة الدخول', date: `${CURRENT_YEAR}-05-21`, timeIn: '08:05', timeOut: '', idType: 'الهوية الوطنية', notes: '', createdAt: new Date() },
    { id: 'demo_e2', type: 'employee', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[2], name: 'مريم سعيد', phone: '', department: 'التصميم', purpose: 'موظف جديد', date: `${CURRENT_YEAR}-05-22`, timeIn: '08:50', timeOut: '', idType: 'الهوية الوطنية', notes: 'بدون تصريح دخول بعد', createdAt: new Date() },
    { id: 'demo_e3', type: 'employee', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[1], name: 'خالد العامري', phone: '', department: 'المبيعات', purpose: 'زيارة قسم آخر', date: `${CURRENT_YEAR}-05-22`, timeIn: '13:20', timeOut: '', idType: 'بطاقة عمل', notes: '', createdAt: new Date() },
    { id: 'demo_e4', type: 'employee', year: CURRENT_YEAR, location: PREDEFINED_LOCATIONS[2], name: 'نورة المنصوري', phone: '', department: 'خدمة العملاء', purpose: 'نسيان بطاقة الدخول', date: `${CURRENT_YEAR}-05-23`, timeIn: '08:10', timeOut: '', idType: 'الهوية الوطنية', notes: '', createdAt: new Date() },
];


export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [records, setRecords] = useState<Record[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form'); 
  const [xlsxLoaded, setXlsxLoaded] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null); 
  const [editingId, setEditingId] = useState<string | null>(null); 
  const [importStatus, setImportStatus] = useState<{ status: 'idle' | 'importing' | 'success' | 'error', message?: string }>({ status: 'idle' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>(''); 
  const [filterYear, setFilterYear] = useState<string>(''); 
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(false);
  const isInitialMount = useRef(true);

  const initialFormState: FormDataState = {
    type: 'visitor', year: CURRENT_YEAR, location: '', name: '', phone: '',
    department: '', purpose: '', date: new Date().toISOString().split('T')[0],
    timeIn: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    timeOut: '', idType: 'الهوية الوطنية', notes: ''
  };
  const [formData, setFormData] = useState<FormDataState>(initialFormState);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadScript("https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js")
      .then(() => setXlsxLoaded(true))
      .catch(e => console.error("Failed to load XLSX script", e));
      
    const bannerDismissed = sessionStorage.getItem('welcomeBannerDismissed');
    if (!bannerDismissed) {
      setShowWelcomeBanner(true);
    }

    try {
        const localData = localStorage.getItem('visitor_records');
        if (localData && JSON.parse(localData).length > 0) {
            setRecords(JSON.parse(localData));
        } else {
            setRecords(demoRecords);
        }
    } catch (e) {
        console.error("Failed to parse local data, falling back to demo records:", e);
        setRecords(demoRecords);
        localStorage.clear();
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
    } else {
        setSortOrder('desc');
    }
  }, [filterYear]);

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
    sessionStorage.setItem('welcomeBannerDismissed', 'true');
  };

  const filteredRecords = useMemo(() => {
    let data = [...records];
    if (startDate) data = data.filter(record => record.date >= startDate);
    if (endDate) data = data.filter(record => record.date <= endDate);
    if (filterLocation) data = data.filter(record => record.location === filterLocation);
    if (filterYear) data = data.filter(record => String(record.year) === String(filterYear));
    if (filterMonth) data = data.filter(record => record.date.substring(5, 7) === filterMonth);
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(record => Object.values(record).some(val => String(val).toLowerCase().includes(lowerSearch)));
    }
    data.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.timeIn}`);
      const dateB = new Date(`${b.date}T${b.timeIn}`);
      const timeA = dateA.getTime(); const timeB = dateB.getTime();
      const aIsInvalid = isNaN(timeA); const bIsInvalid = isNaN(timeB);
      if (aIsInvalid && bIsInvalid) return 0;
      if (aIsInvalid) return 1; if (bIsInvalid) return -1;
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
    return data;
  }, [records, startDate, endDate, filterLocation, filterYear, filterMonth, sortOrder, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (formErrors[e.target.name]) setFormErrors(prev => ({...prev, [e.target.name]: ''}));
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTouched(prev => ({...prev, [e.target.name]: true }));
  };

  const validateForm = (): boolean => {
      const errors: { [key: string]: string } = {};
      if (!formData.name.trim()) errors.name = 'اسم المراجع مطلوب.';
      if (!formData.location.trim()) errors.location = 'اسم المقر مطلوب.';
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const startEdit = (record: Record) => {
    setFormData({ type: record.type, year: record.year, location: record.location, name: record.name, phone: record.phone, department: record.department, purpose: record.purpose, date: record.date, timeIn: record.timeIn, timeOut: record.timeOut, idType: record.idType, notes: record.notes });
    setEditingId(record.id); setActiveTab('form'); setFormErrors({});
    const allTouched = Object.keys(record).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => { 
    setFormData(initialFormState); setEditingId(null); setFormErrors({}); setTouched({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const now = new Date();
    let finalRecord: Record;

    if (editingId) {
        const originalRecord = records.find(r => r.id === editingId);
        finalRecord = {
            ...formData,
            id: editingId,
            createdAt: originalRecord?.createdAt || now,
            lastModified: now
        };
    } else {
        finalRecord = {
            ...formData,
            id: `local_${now.getTime()}`,
            createdAt: now
        };
    }
    
    const newRecords = editingId 
      ? records.map(rec => (rec.id === editingId ? finalRecord : rec)) 
      : [finalRecord, ...records];
      
    setRecords(newRecords);
    localStorage.setItem('visitor_records', JSON.stringify(newRecords));
    setSubmitStatus(editingId ? 'updated' : 'success_offline');

    setFormData(initialFormState);
    setTouched({});
    setEditingId(null);
    
    setTimeout(() => setSubmitStatus(null), 3000);
  };

  const handleConfirmDelete = () => {
    if (!recordToDelete) return;
    const newRecords = records.filter(record => record.id !== recordToDelete);
    setRecords(newRecords);
    localStorage.setItem('visitor_records', JSON.stringify(newRecords));
    setRecordToDelete(null);
  };
  
  const handleSortChange = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const handleExportExcel = () => {
    if (!window.XLSX || !xlsxLoaded) {
      alert("مكتبة التصدير لم يتم تحميلها بعد.");
      return;
    }

    const wb = window.XLSX.utils.book_new();
    const fileName = `سجل_الزوار_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    const headers = ["م", "السنة", "التاريخ", "اليوم", "اسم المقر", "الإسم", "رقم الهاتف", "الإدارة المتجه اليها", "الغرض", "توقيت الدخول", "توقيت الخروج", "اثبات الهوية", "الملاحظات"];
    
    const createSheet = (data: Record[], sheetName: string) => {
        const sheetData = data.map((rec, i) => [
            i + 1, rec.year, rec.date, new Date(rec.date).toLocaleDateString('ar-AE', { weekday: 'long' }), 
            rec.location, rec.name, rec.phone, rec.department, rec.purpose, rec.timeIn, rec.timeOut, 
            rec.idType, rec.notes
        ]);

        const finalSheetData = [headers, ...sheetData];
        const ws = window.XLSX.utils.aoa_to_sheet(finalSheetData);
        ws['!cols'] = Array(headers.length).fill({ wch: 20 });
        window.XLSX.utils.book_append_sheet(wb, ws, sheetName);
    };

    if (visitorRecords.length > 0) createSheet(visitorRecords, "الزوار");
    if (supplierRecords.length > 0) createSheet(supplierRecords, "الموردين");
    if (employeeRecords.length > 0) createSheet(employeeRecords, "الموظفين");

    if (wb.SheetNames.length > 0) {
        window.XLSX.writeFile(wb, fileName);
    } else {
        alert("لا توجد بيانات للتصدير بناءً على الفلاتر المحددة.");
    }
  };
  
  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]; if (!file) return;
      setImportStatus({ status: 'importing', message: 'جاري استيراد البيانات...' });
      try {
          if (!window.XLSX) await loadScript("https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js");
          const data = await file.arrayBuffer(); const wb = window.XLSX.read(data); const ws = wb.Sheets[wb.SheetNames[0]];
          const rows: any[][] = window.XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
          const headerRowIndex = rows.findIndex(r => r.some(cell => typeof cell === 'string' && (cell.trim() === "الإسم" || cell.trim() === "الاسم")) && r.some(cell => typeof cell === 'string' && cell.trim() === "التاريخ"));
          if (headerRowIndex === -1) throw new Error("فشل الاستيراد: لم يتم العثور على رؤوس الأعمدة المتوقعة (مثل 'الاسم' و 'التاريخ').");
          
          const headers = rows[headerRowIndex].map(h => String(h || '').trim());
          const dataRows = rows.slice(headerRowIndex + 1);
          if (dataRows.length === 0) throw new Error("فشل الاستيراد: الملف لا يحتوي على أي بيانات صالحة.");

          const headerMap: { [key: string]: keyof FormDataState } = { "السنة": "year", "التاريخ": "date", "اسم المقر": "location", "الإسم": "name", "الاسم": "name", "رقم الهاتف": "phone", "الإدارة المتجه اليها": "department", "الغرض": "purpose", "توقيت الدخول": "timeIn", "توقيت الخروج": "timeOut", "اثبات الهوية": "idType", "الملاحظات": "notes" };
          const indices: { [key in keyof FormDataState]?: number } = {};
          Object.entries(headerMap).forEach(([header, modelKey]) => {
              const index = headers.indexOf(header);
              if (index > -1) indices[modelKey] = index;
          });
          
          if (indices.name === undefined || indices.date === undefined) throw new Error("فشل الاستيراد: الملف يفتقد لأعمدة أساسية (الاسم أو التاريخ).");
          
          const excelSerialToJSDate = (s: number) => new Date(Math.round((s - 25569) * 86400 * 1000));
          
          const importedRecords = dataRows.map((row, i) => {
              const record: Partial<Record> = {};
              for (const key in indices) {
                  const modelKey = key as keyof typeof indices;
                  const idx = indices[modelKey];
                  if (idx !== undefined && row[idx] !== null && row[idx] !== undefined) {
                      let value = row[idx];
                      if (modelKey === 'date' && typeof value === 'number' && value > 1) {
                        value = excelSerialToJSDate(value).toISOString().split('T')[0];
                      }
                      (record as any)[modelKey] = String(value);
                  }
              }
              return { ...initialFormState, ...record, id: `imported_${Date.now()}_${i}`, createdAt: new Date() } as Record;
          }).filter(r => r.name && r.date);

          if (importedRecords.length === 0) throw new Error("لم يتم العثور على سجلات صالحة للاستيراد.");

          const updatedRecords = [...importedRecords, ...records]; setRecords(updatedRecords);
          localStorage.setItem('visitor_records', JSON.stringify(updatedRecords));
          setImportStatus({ status: 'success', message: `تم استيراد ${importedRecords.length} سجل محلياً بنجاح!` });
      } catch (error: any) { setImportStatus({ status: 'error', message: error.message });
      } finally { if(e.target) e.target.value = ''; setTimeout(() => setImportStatus({ status: 'idle' }), 5000); }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setFilterLocation('');
    setFilterYear('');
    setFilterMonth('');
    setSortOrder('desc');
  };
  
  const visitorRecords = filteredRecords.filter(r => r.type === 'visitor');
  const supplierRecords = filteredRecords.filter(r => r.type === 'supplier');
  const employeeRecords = filteredRecords.filter(r => r.type === 'employee');
  
  const baseInputClasses = "w-full p-3 border border-slate-300 rounded-lg bg-slate-100 text-black placeholder-slate-500 transition-colors duration-200 ease-in-out focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
  const filterInputClasses = "px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-black placeholder-slate-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors";
  const labelClasses = "block mb-1 text-sm font-medium text-slate-700";

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-100"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  
  return (
    <div className="min-h-screen bg-transparent text-slate-800 font-sans flex flex-col" dir="rtl">
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3" dir="ltr">
                    <div className="w-11 h-11 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-2xl font-sans shadow-lg transform hover:scale-105 transition-transform">
                        S
                    </div>
                    <div>
                        <span className="font-extrabold text-white text-xl tracking-wide block leading-tight">SAHER</span>
                        <span className="text-[10px] text-slate-300 tracking-widest uppercase block leading-tight">For Smart Services</span>
                    </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">نظام تسجيل الزوار والموردين</h1>
                  <p className="text-sm text-slate-300">شركة ساهر - مقرات شركة ساهر للخدمات الذكية</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-base text-slate-300 bg-slate-800 px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5" />
                <span>{new Date().toLocaleDateString('ar-AE', { weekday: 'long' })}</span>
                <span dir="ltr">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <WelcomeBanner isVisible={showWelcomeBanner} onDismiss={handleDismissBanner} />
        
        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('form')} className={`px-6 py-3 rounded-lg font-medium shadow-sm ${activeTab === 'form' ? 'bg-blue-600 text-white' : 'bg-white'}`}>{editingId ? 'تعديل السجل' : 'تسجيل جديد'}</button>
          <button onClick={() => { if (editingId) cancelEdit(); setActiveTab('list'); }} className={`px-6 py-3 rounded-lg font-medium shadow-sm ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}>عرض السجل ({filteredRecords.length})</button>
        </div>

        {activeTab === 'form' && (
          <div className="bg-slate-50 rounded-xl shadow-lg p-6 max-w-4xl mx-auto border animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <FilePenLine className="w-6 h-6 text-slate-600" />
              <span>{editingId ? 'تعديل بيانات' : 'بيانات الدخول'}</span>
            </h2>
            {submitStatus && <div className={`mb-4 p-3 rounded-lg text-sm ${submitStatus.startsWith('success') || submitStatus === 'updated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{ {success_offline: 'تم الحفظ بنجاح.', updated: 'تم التحديث بنجاح.', error: 'حدث خطأ.'}[submitStatus] }</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label htmlFor="type" className={`${labelClasses} flex items-center gap-2`}>
                    <ClipboardCopy className="w-4 h-4 text-slate-500" />
                    <span>النوع</span>
                  </label>
                  <select id="type" name="type" value={formData.type} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.type ? 'bg-white' : ''}`}><option value="visitor">زائر</option><option value="supplier">مورد</option><option value="employee">موظف</option></select>
                </div>
                <div>
                  <label htmlFor="year" className={`${labelClasses} flex items-center gap-2`}>
                    <CalendarIcon className="w-4 h-4 text-slate-500" />
                    <span>السنة</span>
                  </label>
                  <select id="year" name="year" value={formData.year} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.year ? 'bg-white' : ''}`}>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
                </div>
                <div>
                  <label htmlFor="date" className={`${labelClasses} flex items-center gap-2`}>
                    <CalendarIcon className="w-4 h-4 text-slate-500" />
                    <span>التاريخ</span>
                  </label>
                  <input id="date" type="date" name="date" required value={formData.date} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.date ? 'bg-white' : ''}`} dir="ltr" />
                </div>
              </div>
              <div>
                  <label htmlFor="location" className={`${labelClasses} flex items-center gap-2`}>
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>اسم المقر</span>
                  </label>
                  <input id="location" type="text" list="locations-list" name="location" value={formData.location} onChange={handleInputChange} onFocus={handleFocus} placeholder="اسم المقر" className={`${baseInputClasses} ${touched.location ? 'bg-white' : ''} ${formErrors.location ? 'border-red-500 focus:border-red-500' : ''}`} /><datalist id="locations-list">{PREDEFINED_LOCATIONS.map(l => <option key={l} value={l} />)}</datalist>
                  {formErrors.location && <p className="text-red-600 text-xs mt-1">{formErrors.location}</p>}
              </div>
              <div>
                  <label htmlFor="name" className={`${labelClasses} flex items-center gap-2`}>
                    <User className="w-4 h-4 text-slate-500" />
                    <span>اسم المراجع</span>
                  </label>
                  <input id="name" type="text" name="name" required placeholder="اسم المراجع" value={formData.name} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${formData.name ? 'bg-white' : ''} ${formErrors.name ? 'border-red-500 focus:border-red-500' : ''}`} />
                  {formErrors.name && <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className={`${labelClasses} flex items-center gap-2`}>
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>رقم الهاتف</span>
                </label>
                <input id="phone" type="text" name="phone" placeholder="رقم الهاتف" value={formData.phone} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${formData.phone ? 'bg-white' : ''} text-right`} dir="ltr" />
              </div>
              <div>
                <label htmlFor="department" className={`${labelClasses} flex items-center gap-2`}>
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>الإدارة المتجه اليها</span>
                </label>
                <input id="department" type="text" name="department" placeholder="الإدارة المتجه اليها" value={formData.department} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.department ? 'bg-white' : ''}`} />
              </div>
               <div>
                <label htmlFor="purpose" className={`${labelClasses} flex items-center gap-2`}>
                  <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                  <span>الغرض من الزيارة</span>
                </label>
                <input id="purpose" type="text" name="purpose" placeholder="الغرض من الزيارة" value={formData.purpose} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.purpose ? 'bg-white' : ''}`} />
              </div>
              <div>
                <label htmlFor="timeIn" className={`${labelClasses} flex items-center gap-2`}>
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>توقيت الدخول</span>
                </label>
                <input id="timeIn" type="time" name="timeIn" value={formData.timeIn} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.timeIn ? 'bg-white' : ''}`} dir="ltr" />
              </div>
              <div>
                <label htmlFor="timeOut" className={`${labelClasses} flex items-center gap-2`}>
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>توقيت الخروج</span>
                </label>
                <input id="timeOut" type="time" name="timeOut" value={formData.timeOut} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.timeOut ? 'bg-white' : ''}`} dir="ltr" />
              </div>
              <div>
                 <label htmlFor="idType" className={`${labelClasses} flex items-center gap-2`}>
                   <CreditCard className="w-4 h-4 text-slate-500" />
                   <span>إثبات الهوية</span>
                  </label>
                <select id="idType" name="idType" value={formData.idType} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.idType ? 'bg-white' : ''}`}><option>الهوية الوطنية</option><option>رخصة قيادة</option><option>جواز سفر</option><option>بطاقة عمل</option><option>أخرى</option></select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className={`${labelClasses} flex items-center gap-2`}>
                  <Pencil className="w-4 h-4 text-slate-500" />
                  <span>الملاحظات</span>
                </label>
                <textarea id="notes" name="notes" rows={3} placeholder="الملاحظات" value={formData.notes} onChange={handleInputChange} onFocus={handleFocus} className={`${baseInputClasses} ${touched.notes ? 'bg-white' : ''}`} />
              </div>
              <div className="md:col-span-2 flex gap-4"><button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">{editingId ? 'تحديث' : 'حفظ'}</button>{editingId && <button type="button" onClick={cancelEdit} className="w-1/3 bg-slate-200 py-3 rounded-lg hover:bg-slate-300 transition-colors">إلغاء</button>}</div>
            </form>
          </div>
        )}
        
        {activeTab === 'list' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-50 p-4 rounded-xl shadow-lg border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">السجلات ({filteredRecords.length})</h3>
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
                   {importStatus.status !== 'idle' && (
                        <div className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                            importStatus.status === 'importing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            importStatus.status === 'success' ? 'bg-green-100 text-green-800 border-green-200' :
                            'bg-red-100 text-red-800 border-red-200'
                        }`}>
                            {importStatus.status === 'importing' && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                            {importStatus.status === 'success' && <CheckCircle className="w-4 h-4" />}
                            {importStatus.status === 'error' && <AlertCircle className="w-4 h-4" />}
                            <span>{importStatus.message}</span>
                        </div>
                    )}
                  <button onClick={handleImportClick} disabled={!xlsxLoaded} className="px-4 py-2 rounded-lg text-sm bg-slate-600 text-white disabled:opacity-50 flex items-center gap-2"><Upload className="w-4 h-4" /> استيراد</button>
                  <button onClick={handleExportExcel} disabled={!xlsxLoaded || filteredRecords.length === 0} className="px-4 py-2 rounded-lg text-sm bg-blue-700 text-white disabled:opacity-50 flex items-center gap-2"><Download className="w-4 h-4" /> تصدير Excel</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="بحث..." className={filterInputClasses} />
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={filterInputClasses}><option value="">كل السنوات</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
                <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className={filterInputClasses}>
                  <option value="">كل الشهور</option>
                  {MONTHS.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                </select>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={filterInputClasses} />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={filterInputClasses} />
                <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className={filterInputClasses}><option value="">كل المقرات</option>{PREDEFINED_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}</select>
                <button onClick={clearFilters} className={`${filterInputClasses} bg-slate-100 hover:bg-slate-200 flex items-center gap-2`}><FilterX className="w-4 h-4 text-slate-500" /> مسح</button>
              </div>
            </div>
            <TableSection title="سجل الزوار" data={visitorRecords} icon={Users} colorTheme="blue" onEdit={startEdit} onDelete={setRecordToDelete} sortOrder={sortOrder} onSortChange={handleSortChange} />
            <TableSection title="سجل الموردين" data={supplierRecords} icon={Truck} colorTheme="purple" onEdit={startEdit} onDelete={setRecordToDelete} sortOrder={sortOrder} onSortChange={handleSortChange} />
            <TableSection title="سجل الموظفين (بدون تصريح)" data={employeeRecords} icon={UserCog} colorTheme="orange" onEdit={startEdit} onDelete={setRecordToDelete} sortOrder={sortOrder} onSortChange={handleSortChange} />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 mt-auto border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
            
            <div>
              <h3 className="inline-block text-base font-semibold text-slate-300 tracking-wider uppercase pb-1 border-b-2 border-yellow-400">عن SAHER</h3>
              <p className="text-sm leading-relaxed mt-3">
                شركة رائدة في تقديم الحلول والأنظمة الذكية، ملتزمون بالابتكار والجودة لتحقيق أعلى مستويات الكفاءة والخدمات الذكية.
              </p>
            </div>

            <div>
              <h3 className="inline-block text-base font-semibold text-slate-300 tracking-wider uppercase pb-1 border-b-2 border-yellow-400">روابط سريعة</h3>
              <ul className="space-y-1 text-sm mt-3">
                <li><a href="#" className="hover:text-white transition-colors">الرئيسية</a></li>
                <li><a href="#" className="hover:text-white transition-colors">خدماتنا</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تواصل معنا</a></li>
              </ul>
            </div>

            <div>
              <h3 className="inline-block text-base font-semibold text-slate-300 tracking-wider uppercase pb-1 border-b-2 border-yellow-400">تواصل معنا</h3>
              <ul className="space-y-2 text-sm mt-3">
                <li className="flex items-start justify-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-500 mt-1 flex-shrink-0" />
                  <p className="text-sm" dir="ltr">Level 3, Baynona Building, Khalif City A</p>
                </li>
                <li className="flex items-center justify-start gap-3">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <a href="tel:+97141234567" className="hover:text-white transition-colors" dir="ltr">+971 4 123 4567</a>
                </li>
                <li className="flex items-center justify-start gap-3">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <a href="mailto:Logistic@saher.ae" className="hover:text-white transition-colors">Logistic@saher.ae</a>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-slate-700 mt-6 pt-4 text-center">
            <p className="text-sm mb-1 text-white">اعداد وتصميم / خالد الجفري</p>
            <p className="text-xs">جميع الحقوق محفوظة لـ © 2026 SAHER FOR SMART SERVICES</p>
          </div>
        </div>
      </footer>


      <ConfirmationModal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد من رغبتك في حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </div>
  );
}