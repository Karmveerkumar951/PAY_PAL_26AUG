import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
  FileText, Camera, Upload, Shield, Eye, EyeOff, Trash2, 
  Download, Share, Plus, Search, Filter, Lock, Unlock,
  CreditCard, IdCard, Car, Plane, Building, User, MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

interface Document {
  id: string;
  type: 'aadhaar' | 'pan' | 'license' | 'passport' | 'metro' | 'credit' | 'other';
  name: string;
  number?: string;
  expiryDate?: string;
  issueDate?: string;
  imageUrl: string;
  extractedData: Record<string, string>;
  uploadDate: Date;
  isVerified: boolean;
}

type ViewMode = 'grid' | 'scan' | 'detail';

const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'aadhaar',
    name: 'Aadhaar Card',
    number: '****-****-1234',
    imageUrl: '/api/placeholder/document1',
    extractedData: {
      name: 'Rakesh Kumar',
      address: 'Mumbai, Maharashtra',
      dob: '15/08/1990'
    },
    uploadDate: new Date('2024-01-15'),
    isVerified: true
  },
  {
    id: '2',
    type: 'pan',
    name: 'PAN Card',
    number: 'ABCDE1234F',
    imageUrl: '/api/placeholder/document2',
    extractedData: {
      name: 'Rakesh Kumar',
      father: 'Suresh Kumar',
      dob: '15/08/1990'
    },
    uploadDate: new Date('2024-01-10'),
    isVerified: true
  },
  {
    id: '3',
    type: 'license',
    name: 'Driving License',
    number: 'MH12-2019-0012345',
    expiryDate: '2029-08-15',
    imageUrl: '/api/placeholder/document3',
    extractedData: {
      name: 'Rakesh Kumar',
      address: 'Mumbai, Maharashtra',
      class: 'MCWG, LMV-NT'
    },
    uploadDate: new Date('2024-01-08'),
    isVerified: true
  }
];

export default function DocumentLocker() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authenticate to unlock vault
  const unlockVault = async () => {
    setIsProcessing(true);
    // Simulate biometric authentication
    setTimeout(() => {
      setIsProcessing(false);
      setIsUnlocked(true);
    }, 2000);
  };

  // Lock vault
  const lockVault = () => {
    setIsUnlocked(false);
    setShowSensitive(false);
    setSelectedDoc(null);
  };

  // Simulate OCR processing
  const processOCR = (file: File): Promise<Document> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockExtractedData = {
          name: 'John Doe',
          number: 'AUTO-DETECTED-123',
          address: 'Auto-extracted address',
          dob: '01/01/1990'
        };

        const newDoc: Document = {
          id: Date.now().toString(),
          type: 'other',
          name: file.name,
          imageUrl: URL.createObjectURL(file),
          extractedData: mockExtractedData,
          uploadDate: new Date(),
          isVerified: false
        };

        resolve(newDoc);
      }, 3000);
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const newDoc = await processOCR(file);
      setDocuments(prev => [...prev, newDoc]);
      setSelectedDoc(newDoc);
      setViewMode('detail');
    } catch (error) {
      console.error('OCR processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.extractedData.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'aadhaar': return User;
      case 'pan': return IdCard;
      case 'license': return Car;
      case 'passport': return Plane;
      case 'metro': return Building;
      case 'credit': return CreditCard;
      default: return FileText;
    }
  };

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'aadhaar': return 'from-blue-500/20 to-indigo-500/20 border-blue-400/30';
      case 'pan': return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
      case 'license': return 'from-orange-500/20 to-red-500/20 border-orange-400/30';
      case 'passport': return 'from-purple-500/20 to-violet-500/20 border-purple-400/30';
      case 'metro': return 'from-cyan-500/20 to-blue-500/20 border-cyan-400/30';
      case 'credit': return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-400/30';
    }
  };

  if (!isUnlocked) {
    return <VaultLockScreen onUnlock={unlockVault} isProcessing={isProcessing} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Header */}
      <header className="relative z-50 flex justify-between items-center p-6 md:p-8">
        <Link to="/" className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-cyber-cyan" />
          <span className="text-xl font-bold bg-gradient-to-r from-cyber-cyan to-blue-400 bg-clip-text text-transparent">
            Secure Vault
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-green-400">
            <Shield className="w-4 h-4" />
            <span>Vault Unlocked</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={lockVault}
            className="text-muted-foreground hover:text-cyber-cyan transition-colors"
          >
            <Lock className="w-6 h-6" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 px-6 md:px-8 pb-8">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <GridView
              documents={filteredDocs}
              searchTerm={searchTerm}
              filterType={filterType}
              showSensitive={showSensitive}
              onSearchChange={setSearchTerm}
              onFilterChange={setFilterType}
              onToggleSensitive={() => setShowSensitive(!showSensitive)}
              onSelectDoc={(doc) => {
                setSelectedDoc(doc);
                setViewMode('detail');
              }}
              onAddDocument={() => fileInputRef.current?.click()}
              getDocumentIcon={getDocumentIcon}
              getDocumentColor={getDocumentColor}
            />
          )}
          
          {viewMode === 'detail' && selectedDoc && (
            <DetailView
              document={selectedDoc}
              showSensitive={showSensitive}
              onBack={() => setViewMode('grid')}
              onToggleSensitive={() => setShowSensitive(!showSensitive)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Processing overlay */}
      {isProcessing && <ProcessingOverlay />}
    </div>
  );
}

// Vault Lock Screen
const VaultLockScreen = ({ onUnlock, isProcessing }: { onUnlock: () => void; isProcessing: boolean }) => (
  <div className="min-h-screen bg-gradient-to-br from-dark-slate-950 via-dark-slate-900 to-dark-slate-800 text-foreground flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
    
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center z-10"
    >
      <div className="w-32 h-32 mx-auto mb-8 relative">
        <motion.div
          animate={isProcessing ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
          className="w-full h-full bg-gradient-to-br from-cyber-cyan/20 to-blue-500/20 rounded-full flex items-center justify-center border-2 border-cyber-cyan/30"
        >
          <Lock className="w-16 h-16 text-cyber-cyan" />
        </motion.div>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">
        Secure Document Vault
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Biometric authentication required to access your documents
      </p>

      {isProcessing ? (
        <div className="flex items-center justify-center space-x-2 text-cyber-cyan">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-2 bg-cyber-cyan rounded-full"
          />
          <span>Authenticating...</span>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUnlock}
          className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 mx-auto hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
        >
          <Unlock className="w-5 h-5" />
          <span>Unlock with Biometrics</span>
        </motion.button>
      )}
    </motion.div>
  </div>
);

// Grid View Component
const GridView = ({
  documents,
  searchTerm,
  filterType,
  showSensitive,
  onSearchChange,
  onFilterChange,
  onToggleSensitive,
  onSelectDoc,
  onAddDocument,
  getDocumentIcon,
  getDocumentColor
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-4">Document Vault</h1>
      <p className="text-muted-foreground">
        Securely store and manage your important documents
      </p>
    </div>

    {/* Controls */}
    <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex gap-4 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card/30 border border-border/30 rounded-lg focus:outline-none focus:border-cyber-cyan/50 text-foreground"
          />
        </div>

        {/* Filter */}
        <select
          value={filterType}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 bg-card/30 border border-border/30 rounded-lg focus:outline-none focus:border-cyber-cyan/50 text-foreground"
        >
          <option value="all">All Types</option>
          <option value="aadhaar">Aadhaar</option>
          <option value="pan">PAN</option>
          <option value="license">License</option>
          <option value="passport">Passport</option>
          <option value="credit">Credit Cards</option>
        </select>
      </div>

      <div className="flex gap-4">
        {/* Toggle sensitive data */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSensitive}
          className="flex items-center space-x-2 px-4 py-2 border border-border/30 rounded-lg hover:bg-card/30 transition-all"
        >
          {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-sm">{showSensitive ? 'Hide' : 'Show'} Details</span>
        </motion.button>

        {/* Add document */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddDocument}
          className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Document</span>
        </motion.button>
      </div>
    </div>

    {/* Document Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc: Document, index: number) => {
        const Icon = getDocumentIcon(doc.type);
        return (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => onSelectDoc(doc)}
            className={`p-6 rounded-xl bg-gradient-to-br ${getDocumentColor(doc.type)} backdrop-blur-sm border cursor-pointer hover:shadow-lg transition-all duration-300`}
          >
            {/* Document Icon & Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icon className="w-8 h-8 text-cyber-cyan" />
                <div>
                  <h3 className="font-semibold">{doc.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {doc.uploadDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              {doc.isVerified && (
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
              )}
            </div>

            {/* Document Details */}
            <div className="space-y-2">
              {doc.number && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Number:</span>
                  <span className="text-sm font-mono">
                    {showSensitive ? doc.number : '****-****-' + doc.number.slice(-4)}
                  </span>
                </div>
              )}
              
              {doc.extractedData.name && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span className="text-sm">
                    {showSensitive ? doc.extractedData.name : doc.extractedData.name.charAt(0) + '***'}
                  </span>
                </div>
              )}

              {doc.expiryDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Expires:</span>
                  <span className="text-sm">{doc.expiryDate}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/30">
              <span className="text-xs text-muted-foreground capitalize">{doc.type}</span>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download logic
                  }}
                  className="p-1 rounded hover:bg-card/50 transition-colors"
                >
                  <Download className="w-4 h-4 text-muted-foreground" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Share logic
                  }}
                  className="p-1 rounded hover:bg-card/50 transition-colors"
                >
                  <Share className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>

    {documents.length === 0 && (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No documents found</h3>
        <p className="text-muted-foreground mb-6">
          {searchTerm || filterType !== 'all' 
            ? 'Try adjusting your search or filter' 
            : 'Start by adding your first document'
          }
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddDocument}
          className="bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Your First Document</span>
        </motion.button>
      </div>
    )}
  </motion.div>
);

// Detail View Component
const DetailView = ({ 
  document, 
  showSensitive, 
  onBack, 
  onToggleSensitive 
}: {
  document: Document;
  showSensitive: boolean;
  onBack: () => void;
  onToggleSensitive: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    className="max-w-4xl mx-auto"
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-card/30 transition-colors"
        >
          ←
        </motion.button>
        <div>
          <h1 className="text-3xl font-bold">{document.name}</h1>
          <p className="text-muted-foreground">Document Details</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSensitive}
          className="flex items-center space-x-2 px-4 py-2 border border-border/30 rounded-lg hover:bg-card/30 transition-all"
        >
          {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-sm">{showSensitive ? 'Hide' : 'Show'} Sensitive Data</span>
        </motion.button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Document Image */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Document Image</h3>
        <div className="aspect-[3/2] rounded-xl overflow-hidden bg-card/30 border border-border/30">
          <div className="w-full h-full bg-gradient-to-br from-cyber-cyan/10 to-blue-500/10 flex items-center justify-center">
            <FileText className="w-16 h-16 text-cyber-cyan/50" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-cyber-cyan to-blue-500 text-dark-slate-950 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyber-cyan/25 transition-all"
          >
            <Download className="w-4 h-4 inline mr-2" />
            Download
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 border border-cyber-cyan/30 text-cyber-cyan py-2 rounded-lg hover:bg-cyber-cyan/10 transition-all"
          >
            <Share className="w-4 h-4 inline mr-2" />
            Share
          </motion.button>
        </div>
      </div>

      {/* Extracted Data */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Extracted Information</h3>
        
        <div className="space-y-4">
          {Object.entries(document.extractedData).map(([key, value]) => (
            <div key={key} className="p-4 rounded-lg bg-card/30 border border-border/30">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="font-medium">
                  {showSensitive ? value : (
                    key.includes('name') || key.includes('address') 
                      ? value.charAt(0) + '*'.repeat(value.length - 1)
                      : value
                  )}
                </span>
              </div>
            </div>
          ))}
          
          {document.number && (
            <div className="p-4 rounded-lg bg-card/30 border border-border/30">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Document Number:</span>
                <span className="font-mono font-medium">
                  {showSensitive ? document.number : '****-****-' + document.number.slice(-4)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Document Status */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="font-medium text-green-400">
              {document.isVerified ? 'Verified Document' : 'Pending Verification'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            OCR processing completed • Uploaded {document.uploadDate.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// Processing Overlay
const ProcessingOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-dark-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 mx-auto mb-4 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full"
      />
      <h3 className="text-xl font-semibold mb-2">Processing Document</h3>
      <p className="text-muted-foreground">Extracting data using OCR technology...</p>
    </div>
  </motion.div>
);
