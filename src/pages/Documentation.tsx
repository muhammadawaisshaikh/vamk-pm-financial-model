import React from 'react'

export default function Documentation() {
    return (
        <main className="max-w-4xl mx-auto space-y-8 pb-12">
            <section className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">Project Finance & legal Environment – Financial Model Guide</h1>

                <div className="prose prose-slate max-w-none text-slate-700">
                    <p className="text-lg leading-relaxed mb-6">
                        Welcome to the VAMK Project Financial Model. This tool is designed to help students and project managers
                        evaluate the financial viability of investment projects. It simulates real-world scenarios by integrating
                        core financial components:

                        <div className="grid md:grid-cols-3 gap-6 my-8">
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">CapEx</h3>
                                <p className="text-sm font-semibold text-slate-600 mb-2">Capital Expenditure</p>
                                <p className="text-sm text-slate-600 mb-3">One-time expenses to acquire or upgrade physical assets.</p>
                                <div className="text-xs bg-white p-2 rounded border border-slate-100 text-slate-500">
                                    <strong>Examples:</strong> Machinery, buildings, land, software licenses.
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">OpEx</h3>
                                <p className="text-sm font-semibold text-slate-600 mb-2">Operating Expenditure</p>
                                <p className="text-sm text-slate-600 mb-3">Ongoing costs for running a product, business, or system.</p>
                                <div className="text-xs bg-white p-2 rounded border border-slate-100 text-slate-500">
                                    <strong>Examples:</strong> Salaries, utilities, rent, maintenance, insurance.
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">Revenue</h3>
                                <p className="text-sm font-semibold text-slate-600 mb-2">Financial Projections</p>
                                <p className="text-sm text-slate-600 mb-3">Forecasted income based on unit sales, price, and growth.</p>
                                <div className="text-xs bg-white p-2 rounded border border-slate-100 text-slate-500">
                                    <strong>Key Drivers:</strong> Sales volume, unit price, market growth, inflation.
                                </div>
                            </div>
                        </div>
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
                        <h3 className="text-blue-800 font-semibold mb-2">Learning Objective</h3>
                        <p className="text-blue-700 text-sm">
                            Understand how changing input variables (like inflation, tax rate, or sales volume) impacts the
                            long-term profitability and risk profile of a project within a legal and economic framework.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Video Tutorial</h2>
                <div className="w-full rounded-lg overflow-hidden shadow-sm bg-slate-100">
                    <iframe
                        width="100%"
                        height="550"
                        src="https://www.youtube.com/embed/Iq0YmerjQrA?si=uULiPYuJu4IkiNc_"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full"
                    ></iframe>
                </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Step-by-Step Usage Guide</h2>

                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">1</div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Define Project Inputs</h3>
                            <p className="text-slate-600 mb-3">
                                Begin by entering the core assumptions in the <strong>Inputs</strong> section. These figures form the legal and financial basis of your project proposal.
                            </p>
                            <ul className="list-disc ml-5 space-y-2 text-slate-600">
                                <li><strong>Investment Amount (CapEx):</strong> The initial capital required to start the project. Consider legal requirements for minimum capital.</li>
                                <li><strong>Useful Life:</strong> The legal depreciation period for the asset.</li>
                                <li><strong>Salvage Value:</strong> The estimated residual value at the end of the project life.</li>
                                <li><strong>Tax Rate:</strong> The corporate tax rate applicable in the project's legal jurisdiction (e.g., 20% in Finland).</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">2</div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Operational Projections</h3>
                            <p className="text-slate-600 mb-3">
                                Forecast your revenue and costs. In a Project Finance context, these must be defensible and realistic.
                            </p>
                            <ul className="list-disc ml-5 space-y-2 text-slate-600">
                                <li><strong>Annual Units Sold & Price:</strong> Your base revenue drivers.</li>
                                <li><strong>Variable Costs:</strong> Costs that scale with production (e.g., raw materials).</li>
                                <li><strong>Fixed Costs (OpEx):</strong> Recurring costs independent of production (e.g., rent, insurance, compliance fees).</li>
                                <li><strong>Inflation Rate:</strong> Adjusts future costs and prices, crucial for long-term projects.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">3</div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Analyze Key Metrics</h3>
                            <p className="text-slate-600 mb-3">
                                Review the <strong>Results</strong> table to evaluate project feasibility.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                    <span className="font-bold text-slate-900 block mb-1">NPV (Net Present Value)</span>
                                    <span className="text-sm text-slate-600">Must be positive for a project to be financially viable. It represents the value created in today's money.</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                    <span className="font-bold text-slate-900 block mb-1">IRR (Internal Rate of Return)</span>
                                    <span className="text-sm text-slate-600">The effective interest rate the project pays. Should exceed your cost of capital (WACC).</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                    <span className="font-bold text-slate-900 block mb-1">Payback Period</span>
                                    <span className="text-sm text-slate-600">Time required to recover the initial investment. Shorter is generally lower risk.</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                                    <span className="font-bold text-slate-900 block mb-1">ROI (Return on Investment)</span>
                                    <span className="text-sm text-slate-600">Total profitability relative to the initial cost.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Legal & Environmental Considerations</h2>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-5">
                    <p className="text-amber-900 mb-4">
                        In "Project Finance and Legal Environment", financial numbers do not exist in a vacuum. You must consider:
                    </p>
                    <ul className="list-disc ml-5 space-y-2 text-amber-800">
                        <li><strong>Regulatory Compliance:</strong> Does the project meet environmental standards (ESG)? Non-compliance can lead to fines (increasing OpEx) or shutdown.</li>
                        <li><strong>Contractual Structure:</strong> Project finance relies on contracts (off-take agreements, EPC contracts) to mitigate risk.</li>
                        <li><strong>Tax Law:</strong> Ensure depreciation periods and tax rates match local legislation.</li>
                    </ul>
                </div>
            </section>
        </main >
    )
}
