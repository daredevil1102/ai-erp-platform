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
    phone: '',
    startLocation: '',
    endLocation: ''
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
    if (!newVehicle.startLocation.trim()) {
      addToast('Please enter starting location', 'error')
      return
    }
    if (!newVehicle.endLocation.trim()) {
      addToast('Please enter destination', 'error')
      return
    }
    
    addVehicle({
      id: `VH-${Date.now()}`,
      driver: newVehicle.driver,
      location: `${newVehicle.startLocation} → ${newVehicle.endLocation}`,
      eta: 'Pending',
      status: 'idle',
      progress: 0
    })
    
    setNewVehicle({ driver: '', vehicleNumber: '', phone: '', startLocation: '', endLocation: '' })
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
      <div className="glass rounded-2xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-display font-semibold text-white flex items-center gap-2">
            <MapPin size={18} className="text-accent" />
            Live Fleet Map
          </h3>
          <div className="hidden sm:flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-xs text-muted">In Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-xs text-muted">Delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-highlight" />
              <span className="text-xs text-muted">Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <span className="text-xs text-muted">Idle</span>
            </div>
          </div>
        </div>
        
        {/* Map Container */}
        <div className="relative h-[250px] sm:h-[300px] md:h-[350px] rounded-xl bg-gradient-to-br from-surface to-secondary overflow-hidden border border-white/10">
          {vehicles.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Truck size={48} className="text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">Add vehicles to see them on the map</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 p-4">
              {/* Map Grid Lines */}
              <svg className="w-full h-full opacity-15" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
                <path d="M0,150 L800,150" fill="none" stroke="#00D9FF" strokeWidth="1"/>
                <path d="M400,0 L400,300" fill="none" stroke="#00D9FF" strokeWidth="1"/>
                <path d="M0,75 L800,75" fill="none" stroke="#00D9FF" strokeWidth="0.5" strokeDasharray="4 4"/>
                <path d="M0,225 L800,225" fill="none" stroke="#00D9FF" strokeWidth="0.5" strokeDasharray="4 4"/>
              </svg>
              
              {/* Location Markers - Clearly Visible */}
              <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg">
                <MapPin size={14} className="text-accent" />
                <span className="text-white text-xs font-medium">Mumbai</span>
              </div>
              <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg">
                <MapPin size={14} className="text-highlight" />
                <span className="text-white text-xs font-medium">Pune</span>
              </div>
              <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg">
                <MapPin size={14} className="text-success" />
                <span className="text-white text-xs font-medium">Bangalore</span>
              </div>
              <div className="absolute bottom-4 right-4 glass rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg">
                <MapPin size={14} className="text-warning" />
                <span className="text-white text-xs font-medium">Delhi</span>
              </div>
              
              {/* Route Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M100,150 Q250,80 400,150" fill="none" stroke="#00D9FF" strokeWidth="3" opacity="0.5"/>
                <path d="M400,150 Q550,220 700,150" fill="none" stroke="#00D9FF" strokeWidth="3" opacity="0.5"/>
              </svg>
              
              {/* Vehicles with Position Labels */}
              {vehicles.slice(0, 6).map((v, i) => {
                const positions = [
                  { left: '12%', top: '40%' },
                  { left: '30%', top: '25%' },
                  { left: '50%', top: '55%' },
                  { left: '68%', top: '30%' },
                  { left: '25%', top: '70%' },
                  { left: '60%', top: '65%' },
                ]
                const pos = positions[i % positions.length]
                return (
                  <div
                    key={v.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: pos.left, top: pos.top }}
                  >
                    <div className={clsx(
                      'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-primary',
                      v.status === 'in_transit' && 'bg-accent',
                      v.status === 'delivered' && 'bg-success',
                      v.status === 'delayed' && 'bg-highlight',
                      v.status === 'idle' && 'bg-muted',
                    )}>
                      <Truck size={16} className="text-primary" />
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-[10px] text-white bg-black/60 px-2 py-0.5 rounded whitespace-nowrap">
                        {v.driver.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                )
              })}
              
              {/* Legend Box */}
              <div className="absolute top-4 right-16 hidden sm:block glass rounded-lg p-3 shadow-lg">
                <p className="text-[10px] text-muted mb-2 uppercase tracking-wider">Routes</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-accent" />
                    <span className="text-[10px] text-white">Mumbai → Pune</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-success" />
                    <span className="text-[10px] text-white">Pune → Bangalore</span>
                  </div>
                </div>
              </div>
              
              {/* Vehicle Count Badge */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                <Navigation size={14} className="text-accent" />
                <span className="text-xs text-white font-medium">{vehicles.length} vehicles active</span>
              </div>
            </div>
          )}
          
          {/* Mobile Legend */}
          <div className="sm:hidden absolute top-4 right-4 glass rounded-lg p-2">
            <div className="flex items-center gap-2 text-[10px] text-white">
              <Navigation size={12} className="text-accent" />
              <span>{vehicles.length} active</span>
            </div>
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
            <div>
              <label className="block text-sm text-muted mb-2">Starting Location *</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={newVehicle.startLocation}
                  onChange={(e) => setNewVehicle({ ...newVehicle, startLocation: e.target.value })}
                  placeholder="e.g. Mumbai Warehouse"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">Destination *</label>
              <div className="relative">
                <Navigation size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                <input
                  type="text"
                  value={newVehicle.endLocation}
                  onChange={(e) => setNewVehicle({ ...newVehicle, endLocation: e.target.value })}
                  placeholder="e.g. Pune Factory"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-muted focus:outline-none focus:border-accent"
                />
              </div>
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
