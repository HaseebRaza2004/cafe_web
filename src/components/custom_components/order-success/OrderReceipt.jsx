"use client";

export default function OrderReceipt({ order }) {
    return (
        <div className="w-full max-w-xl px-4 animate-in fade-in zoom-in-95 duration-500 delay-200 print:w-full print:px-0 print:mx-auto my-auto print:min-h-screen">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative print:bg-white print:text-black print:border-none print:shadow-none print:p-4 print:m-0 print:block">

                <div className="hidden print:block text-center mb-6 border-b border-gray-300 pb-4">
                    <h2 className="text-2xl font-bold font-display uppercase tracking-widest text-black">Luxury Cafe</h2>
                    <p className="text-xs text-gray-600 font-medium tracking-wide">Premium Dining Experience</p>
                </div>

                <div className="flex justify-between items-start mb-8 border-b border-white/10 print:border-gray-300 pb-6">
                    <div>
                        <p className="text-[10px] text-gray-500 print:text-gray-500 uppercase tracking-wider font-bold mb-1">Order ID</p>
                        <p className="font-mono text-sm md:text-base font-bold print:text-black">
                            {order._id.slice(-8).toUpperCase()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 print:text-gray-500 uppercase tracking-wider font-bold mb-1">Date</p>
                        <p className="text-sm md:text-base font-bold print:text-black">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-5 mb-8">
                    {order.cartItems.map((item, i) => (
                        <div key={i} className="flex justify-between items-start">
                            <div className="flex-1 pr-4">
                                <p className="font-bold text-sm md:text-base print:text-black">
                                    <span className="text-(--color-gold) print:text-black mr-2 font-black">{item.quantity}x</span>
                                    {item.title}
                                </p>
                                {item.selectedOptions?.length > 0 && (
                                    <div className="text-xs text-gray-400 print:text-gray-600 mt-1 pl-6 flex flex-col gap-1">
                                        {item.selectedOptions.map((opt, idx) => (
                                            <span key={idx}>+ {opt.name}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="font-mono text-sm md:text-base font-medium print:text-black">
                                Rs {(item.price * item.quantity).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bill Summary */}
                <div className="bg-black/40 print:bg-transparent rounded-xl p-5 space-y-3 border border-white/5 print:border-gray-300 print:border-t-2 print:border-b-2 print:border-l-0 print:border-r-0 print:rounded-none">
                    <div className="flex justify-between text-sm text-gray-400 print:text-gray-700 font-medium">
                        <span>Subtotal</span>
                        <span>Rs {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 print:text-gray-700 font-medium">
                        <span>Tax (15%)</span>
                        <span>Rs {Math.round(order.tax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 print:text-gray-700 font-medium">
                        <span>Delivery Fee ({order.deliveryArea})</span>
                        <span>Rs {order.deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-white/10 print:hidden my-2" />
                    <div className="flex justify-between font-black text-lg md:text-xl text-(--color-gold) print:text-black pt-2">
                        <span className="uppercase tracking-widest text-sm self-end pb-1">Grand Total</span>
                        <span>Rs {Math.round(order.totalAmount).toLocaleString()}</span>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center text-xs text-gray-500 print:text-gray-600">
                    <p className="mb-1">Payment Method: <span className="font-bold text-white print:text-black uppercase">{order.paymentMethod}</span></p>
                    {order.changeRequest && <p>Change requested for: <span className="font-bold print:text-black">Rs {order.changeRequest}</span></p>}
                    <p className="mt-6 print:block hidden font-bold text-[10px] uppercase tracking-widest text-black">Thank you for dining with us!</p>
                </div>

            </div>
        </div>
    );
};