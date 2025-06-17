export default function IncidentAnalysis() {
  return (
    <div className='h-full flex flex-col'>
      <div className='p-8 border-b border-gray-200'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Incident Analysis Dashboard</h1>
        <p className='text-lg text-gray-600'>
          Analyze incident patterns and trends to improve safety outcomes
        </p>
      </div>
      <div className='flex-1 p-8 overflow-y-auto'>
        <div className='max-w-4xl mx-auto'>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8'>
            <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Total Incidents</h3>
              <p className='text-3xl font-bold text-blue-600'>24</p>
              <p className='text-sm text-gray-500'>This month</p>
            </div>
            <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Resolved</h3>
              <p className='text-3xl font-bold text-green-600'>18</p>
              <p className='text-sm text-gray-500'>75% resolution rate</p>
            </div>
            <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Pending</h3>
              <p className='text-3xl font-bold text-orange-600'>6</p>
              <p className='text-sm text-gray-500'>Require attention</p>
            </div>
          </div>
          
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 text-center'>
            <h2 className='text-xl font-semibold text-blue-900 mb-2'>Analysis Dashboard Coming Soon</h2>
            <p className='text-blue-700'>
              Advanced analytics and reporting features will be implemented here to help identify trends and improve safety protocols.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
