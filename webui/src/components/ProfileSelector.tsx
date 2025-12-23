import { useReceiverStore } from '../store/receiverStore'
import { receiverCommands } from '../api/receiverAPI'

export default function ProfileSelector() {
  const profiles = useReceiverStore((state) => state.profiles)
  const currentSdrId = useReceiverStore((state) => state.config.sdr_id)
  const currentProfileId = useReceiverStore((state) => state.config.profile_id)

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sdrId, profileId] = e.target.value.split(':')
    if (sdrId && profileId) {
      receiverCommands.setProfile(sdrId, profileId)
    }
  }

  const currentValue = currentSdrId && currentProfileId 
    ? `${currentSdrId}:${currentProfileId}`
    : ''

  return (
    <div className="panel-control">
      <label>Profile</label>
      <select value={currentValue} onChange={handleProfileChange}>
        <option value="">Select profile...</option>
        {profiles.map((profile) => {
          const value = `${profile.id.split(':')[0]}:${profile.id.split(':')[1]}`
          return (
            <option key={profile.id} value={value}>
              {profile.name}
            </option>
          )
        })}
      </select>
    </div>
  )
}

