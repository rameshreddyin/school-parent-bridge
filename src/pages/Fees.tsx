import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { feeData } from '../utils/mockData';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle, IndianRupee, Receipt, Wallet, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const Fees = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [paymentType, setPaymentType] = useState<string>('');
  const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const pendingFees = feeData.filter(fee => fee.status === 'pending' || fee.status === 'overdue');
  const totalPending = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = feeData.filter(fee => fee.status === 'paid');
  const totalPaid = paidFees.reduce((sum, fee) => sum + fee.amount, 0);
  
  const getStatusIcon = (status: 'paid' | 'pending' | 'overdue') => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-amber-600" />;
      case 'overdue':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: 'paid' | 'pending' | 'overdue') => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  const handlePaymentStart = (feeId: string) => {
    setSelectedFeeId(feeId);
    setPaymentType('');
    setReceiptFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmitPayment = () => {
    if (!paymentType) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method.",
        variant: "destructive"
      });
      return;
    }

    if (!receiptFile) {
      toast({
        title: "Receipt required",
        description: "Please upload a receipt for verification.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Payment submitted",
      description: "Your payment receipt has been uploaded and is pending approval.",
    });
    
    setSelectedFeeId(null);
    setPaymentType('');
    setReceiptFile(null);
  };

  const handleDownloadReceipt = (receiptNo: string) => {
    toast({
      title: "Receipt downloading",
      description: `Receipt ${receiptNo} is being downloaded.`,
    });
  };

  return (
    <Layout title="Fees & Payments" showBackButton>
      <div className="space-y-4">
        {/* Fee Summary Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Pending Amount</p>
                <div className="flex items-baseline space-x-1">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <span className="text-3xl font-bold">{totalPending.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="bg-primary/10 text-primary rounded-full p-2">
                <Wallet size={20} />
              </div>
            </div>
            {pendingFees.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">Pay Now</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Choose Payment Method</DialogTitle>
                    <DialogDescription>
                      Select a payment method, make the payment, and upload the receipt for verification.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 my-2">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Select Payment Method</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant={paymentType === 'card' ? 'default' : 'outline'} 
                          className="justify-start"
                          onClick={() => setPaymentType('card')}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit/Debit Card
                        </Button>
                        <Button 
                          variant={paymentType === 'upi' ? 'default' : 'outline'} 
                          className="justify-start"
                          onClick={() => setPaymentType('upi')}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          UPI
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Upload Payment Receipt</h3>
                      <div 
                        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={triggerFileInput}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*,.pdf" 
                          onChange={handleFileChange}
                        />
                        {receiptFile ? (
                          <div className="flex flex-col items-center">
                            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                            <p className="text-sm font-medium">{receiptFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(receiptFile.size / 1024).toFixed(2)} KB
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="mt-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReceiptFile(null);
                              }}
                            >
                              Replace
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Upload Receipt</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Drag and drop or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Supported formats: JPG, PNG, PDF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedFeeId(null)}>Cancel</Button>
                    <Button onClick={handleSubmitPayment}>Submit Payment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t">
              <div className="p-4 border-r">
                <p className="text-sm text-muted-foreground">Paid Fees</p>
                <div className="flex items-baseline space-x-1">
                  <IndianRupee className="h-3 w-3 text-green-600" />
                  <span className="text-xl font-semibold text-green-600">{totalPaid.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">Upcoming Fees</p>
                <div className="flex items-baseline space-x-1">
                  <IndianRupee className="h-3 w-3 text-amber-600" />
                  <span className="text-xl font-semibold text-amber-600">{totalPending.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different fee views */}
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <h3 className="text-lg font-semibold">Fee Details</h3>
            {pendingFees.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Pending Payments</h4>
                {pendingFees.map((fee) => (
                  <Card key={fee.id} className="overflow-hidden">
                    <div className="p-4 border-l-4 border-amber-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{fee.type}</h5>
                          <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                            <Receipt size={14} />
                            <span className="text-xs">Due: {new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline space-x-1">
                            <IndianRupee className="h-3 w-3" />
                            <span className="text-lg font-semibold">{fee.amount.toLocaleString('en-IN')}</span>
                          </div>
                          <Badge variant="outline" className={`mt-1 ${getStatusClass(fee.status)}`}>
                            {getStatusIcon(fee.status)}
                            <span className="ml-1 capitalize">{fee.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => handlePaymentStart(fee.id)}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Pay & Upload Receipt
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Pay Fee: {fee.type}</DialogTitle>
                              <DialogDescription>
                                Amount: ₹{fee.amount.toLocaleString('en-IN')} | Due: {new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 my-2">
                              <div>
                                <h3 className="text-sm font-medium mb-2">Select Payment Method</h3>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button 
                                    variant={paymentType === 'card' ? 'default' : 'outline'} 
                                    className="justify-start"
                                    onClick={() => setPaymentType('card')}
                                  >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Credit/Debit Card
                                  </Button>
                                  <Button 
                                    variant={paymentType === 'upi' ? 'default' : 'outline'} 
                                    className="justify-start"
                                    onClick={() => setPaymentType('upi')}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    UPI
                                  </Button>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-medium mb-2">Upload Payment Receipt</h3>
                                <div 
                                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={triggerFileInput}
                                >
                                  <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*,.pdf" 
                                    onChange={handleFileChange}
                                  />
                                  {receiptFile ? (
                                    <div className="flex flex-col items-center">
                                      <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                                      <p className="text-sm font-medium">{receiptFile.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {(receiptFile.size / 1024).toFixed(2)} KB
                                      </p>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="mt-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setReceiptFile(null);
                                        }}
                                      >
                                        Replace
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center">
                                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                      <p className="text-sm font-medium">Upload Receipt</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Drag and drop or click to browse
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Supported formats: JPG, PNG, PDF
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedFeeId(null)}>Cancel</Button>
                              <Button onClick={handleSubmitPayment}>Submit Payment</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {paidFees.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Recent Payments</h4>
                {paidFees.slice(0, 2).map((fee) => (
                  <Card key={fee.id} className="overflow-hidden">
                    <div className="p-4 border-l-4 border-green-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{fee.type}</h5>
                          <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                            <Receipt size={14} />
                            <span className="text-xs">Paid: {new Date(fee.paidOn!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline space-x-1">
                            <IndianRupee className="h-3 w-3" />
                            <span className="text-lg font-semibold">{fee.amount.toLocaleString('en-IN')}</span>
                          </div>
                          <Badge variant="outline" className={`mt-1 ${getStatusClass(fee.status)}`}>
                            {getStatusIcon(fee.status)}
                            <span className="ml-1 capitalize">{fee.status}</span>
                          </Badge>
                        </div>
                      </div>
                      {fee.receiptNo && (
                        <div className="mt-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary w-full" 
                            onClick={() => handleDownloadReceipt(fee.receiptNo!)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment History</h3>
              <div className="relative w-1/2">
                <Input placeholder="Search payments..." className="pl-8" />
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto subtle-scroll">
              {[...feeData].sort((a, b) => {
                const dateA = a.paidOn ? new Date(a.paidOn).getTime() : new Date(a.dueDate).getTime();
                const dateB = b.paidOn ? new Date(b.paidOn).getTime() : new Date(b.dueDate).getTime();
                return dateB - dateA;
              }).map((fee) => (
                <Card key={fee.id} className="overflow-hidden">
                  <div className={`p-4 border-l-4 ${fee.status === 'paid' ? 'border-green-500' : fee.status === 'overdue' ? 'border-red-500' : 'border-amber-500'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{fee.type}</h5>
                        <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                          <Receipt size={14} />
                          <span className="text-xs">
                            {fee.status === 'paid' 
                              ? `Paid on ${new Date(fee.paidOn!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` 
                              : `Due on ${new Date(fee.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline space-x-1">
                          <IndianRupee className="h-3 w-3" />
                          <span className="text-lg font-semibold">{fee.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <Badge variant="outline" className={`mt-1 ${getStatusClass(fee.status)}`}>
                          {getStatusIcon(fee.status)}
                          <span className="ml-1 capitalize">{fee.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      {fee.status === 'paid' && fee.receiptNo && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary" 
                          onClick={() => handleDownloadReceipt(fee.receiptNo!)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Receipt
                        </Button>
                      )}
                      {(fee.status === 'pending' || fee.status === 'overdue') && (
                        <Button size="sm" 
                          onClick={() => {
                            handlePaymentStart(fee.id);
                          }}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4">
            <h3 className="text-lg font-semibold">Make a Payment</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Select Payment Method</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit/Debit Card
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7.5 12H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        UPI
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Select Fee</h4>
                    <div className="space-y-2">
                      {pendingFees.map((fee) => (
                        <div key={fee.id} className="flex items-center justify-between border rounded-lg p-3">
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              id={`fee-${fee.id}`} 
                              className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`fee-${fee.id}`} className="text-sm font-medium">
                              {fee.type}
                            </label>
                          </div>
                          <div className="flex items-baseline space-x-1">
                            <IndianRupee className="h-3 w-3" />
                            <span className="font-semibold">{fee.amount.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{totalPending.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span>Processing Fee</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex items-center justify-between font-semibold mt-2 pt-2 border-t">
                      <span>Total Amount</span>
                      <span>₹{totalPending.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" 
                    onClick={() => {
                      handleSubmitPayment();
                    }}
                  >
                    Pay ₹{totalPending.toLocaleString('en-IN')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Fees;
