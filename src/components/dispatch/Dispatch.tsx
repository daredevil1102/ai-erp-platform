'use client'
import { useState } from 'react'
import { Truck, Navigation, CheckCircle, AlertCircle, Plus, MapPin } from 'lucide-react'
import { clsx } from 'clsx'
import { useAppStore } from '@/store/appStore'
import { Modal } from '@/components/common/Modal'

export function Dispatch() {
  const { vehicles, addVehicle, updateVehicle, addToast } = useAppStore()
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    driver: '',
    vehicleNumber: '',
    phone: ''
  })

  const handleAddVehicle = () => {
    if (!newVehicle.driver.trim()) {
      addToast('Please enter driver name', 'error')
      return
    }
    if (!newVehicle.vehicleNumber.trim()) {
      addToast('Please enter vehicle number', 'error')
      return
    }
    
    addVehicle({
      id: `VH-${Date.now()}`,
      driver: newVehicle.driver,
      location: 'Depot - Ready to dispatch',
      eta: 'Pending',
      status: 'idle',
      progress: 0
    })
    
    setNewVehicle({ driver: '', vehicleNumber: '', phone: '' })
    setShowAddVehicle(false)
    addToast('Vehicle added successfully', 'success')
  }

  const handleStatusUpdate = (vehicleId: string, status: string) => {
    updateVehicle(vehicleId, { status: status as any })
    addToast(`Vehicle status updated to ${status}`, 'success')
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Dispatch & Tracking</h1>
          <p className="text-muted">Real-time fleet management with GPS tracking</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddVehicle(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Plus size={18} />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Active Vehicles', value: vehicles.length.toString(), icon: Truck },
          { label: 'In Transit', value: vehicles.filter(v => v.status === 'in_transit').length.toString(), icon: Navigation, color: 'accent' },
          { label: 'Delivered Today', value: vehicles.filter(v => v.status === 'delivered').length.toString(), icon: CheckCircle, color: 'success' },
          { label: 'Delayed', value: vehicles.filter(v => v.status === 'delayed').length.toString(), icon: AlertCircle, color: 'highlight' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <stat.icon size={20} className={clsx('mb-3', stat.color ? `text-${stat.color}` : 'text-accent')} />
            <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Live Map */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-semibold text-white">Live Fleet Map</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted">In Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-sm text-muted">Delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-highlight" />
              <span className="text-sm text-muted">Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <span className="text-sm text-muted">Idle</span>
            </div>
          </div>
        </div>
        <div className="relative h-[300px] rounded-xl bg-gradient-to-br from-surface to-secondary overflow-hidden">
          {vehicles.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Truck size={64} className="text-muted mx-auto mb-4" />
                <p className="text-muted">Add vehicles to see them on the map</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0">
              <svg className="w-full h-full opacity-20" viewBox="0 0 800 300">
                <path d="M50,150 Q200,50 400,150 T750,150" fill="none" stroke="#00D9FF" strokeWidth="3" strokeDasharray="8 4"/>
                <path d="M50,200 Q200,100 400,200 T750,200" fill="none" stroke="#00D9FF" strokeWidth="2" strokeDasharray="8 4"/>
              </svg>
              {vehicles.slice(0, 4).map((v, i) => (
                <div
                  key={v.id}
                  className="absolute"
                  style={{ left: `${20 + i * 25}%`, top: `${40 + (i % 2) * 30}%` }}
                >
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    v.status === 'in_transit' && 'bg-accent',
                    v.status === 'delivered' && 'bg-success',
                    v.status === 'delayed' && 'bg-highlight',
                    v.status === 'idle' && 'bg-muted',
                  )}>
                    <Truck size={14} className="text-primary" />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="absolute bottom-4 right-4 glass rounded-lg px-4 py-2 flex items-center gap-2">
            <Navigation size={16} className="text-accent" />
            <span className="text-sm text-muted">{vehicles.length} vehicles</span>
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="glass rounded-2xl p-12 flex flex-col items-center justify-center">
            <Truck size={48} className="text-muted mb-4" />
            <h3 className="text-xl font-display font-semibold text-white mb-2">No vehicles yet</h3>
            <p className="text-muted text-center mb-6">Add your fleet vehicles to start real-time tracking</p>
            <button 
              onClick={() => setShowAddVehicle(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-primary font-semibold"
            >
              <Plus size={18} />
              Add Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      vehicle.status === 'in_transit' && 'bg-accent/20',
                      vehicle.status === 'delivered' && 'bg-success/20',
                      vehicle.status === 'delayed' && 'bg-highlight/20',
                      vehicle.status === 'idle' && 'bg-muted/20',
                    )}>
                      <Truck size={24} className={
                        vehicle.status === 'in_transit' ? 'text-accent' :
                        vehicle.status === 'delivered' ? 'text-success' :
                        vehicle.status === 'delayed' ? 'text-highlight' : 'text-muted'
                      } />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{vehicle.driver}</h4>
                      <p className="text-sm text-muted">{vehicle.id}</p>
                    </div>
                  </div>
                  <select 
                    value={vehicle.status}
                    onChange={(e) => handleStatusUpdate(vehicle.id, e.target.value)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border-0 cursor-pointer"
                  >
                    <option value="idle">Idle</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted">
                    <MapPin size={14} />
                    <span>{vehicle.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Navigation size={14} />
                    <span>{vehicle.eta}</span>
                  </div>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={clsx(
                      'h-full rounded-full transition-all duration-500',
                      vehicle.status === 'in_transit' && 'bg-accent',
                      vehicle.status === 'delivered' && 'bg-success',
                      vehicle.status === 'delayed' && 'bg-highlight',
                      vehicle.status === 'idle' && 'bg-muted',
                    )}
                    style={{ width: `${vehicle.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <Modal title="Add New Vehicle" onClose={() => setShowAddVehicle(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-2">Driver Name *</label>
              <input
                type="text"
                value={newVehicle.driver}
                onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })}
                placeholder="Enter driver name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Vehicle Number *</label>
              <input
                type="text"
                value={newVehicle.vehicleNumber}
                onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}
                placeholder="e.g. MH12AB1234"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Phone Number</label>
              <input
                type="tel"
                value={newVehicle.phone}
                onChange={(e) => setNewVehicle({ ...newVehicle, phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setShowAddVehicle(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddVehicle}
                className="flex-1 px-4 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/80"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
