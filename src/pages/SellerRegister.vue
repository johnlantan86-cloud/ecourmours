<template>
  <div class="register-container">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">🏪 Kigali Great Market</router-link>
        <div class="nav-links">
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </div>
      </div>
    </nav>

    <div class="form-container">
      <div class="form-box">
        <h2>Seller Registration</h2>
        <form @submit.prevent="registerSeller">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              id="name" 
              required
            />
          </div>

          <div class="form-group">
            <label for="businessName">Business Name</label>
            <input 
              v-model="form.businessName" 
              type="text" 
              id="businessName" 
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              id="email" 
              required
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              id="phone" 
              required
            />
          </div>

          <div class="form-group">
            <label for="location">Short Location Name</label>
            <input 
              v-model="form.location" 
              type="text" 
              id="location" 
              list="seller-location-options"
              placeholder="Example: Remera main road, near XYZ building"
            />
            <datalist id="seller-location-options">
              <option v-for="location in shortLocationOptions" :key="location" :value="location" />
            </datalist>
          </div>

          <div class="location-panel">
            <h3>Fast Business Location Setup</h3>
            <div class="location-helper">
              <div class="form-group">
                <label for="quickArea">Choose Business Area</label>
                <select v-model="selectedAreaKey" id="quickArea" @change="applySelectedArea">
                  <option value="">Choose from available areas</option>
                  <option v-for="area in areaOptions" :key="area.key" :value="area.key">
                    {{ area.label }}
                  </option>
                </select>
              </div>

              <button type="button" class="btn-location" @click="useCurrentPosition" :disabled="locating">
                {{ locating ? 'Getting location...' : 'Use Current Position' }}
              </button>

              <button type="button" class="btn-location btn-light" @click="showDetailedLocation = !showDetailedLocation">
                {{ showDetailedLocation ? 'Hide Details' : 'Add Details' }}
              </button>
            </div>

            <p v-if="locationPreview" class="location-preview">
              Selected: {{ locationPreview }}
            </p>

            <div v-if="showDetailedLocation" class="location-grid">
              <div class="form-group">
                <label for="province">Province / City</label>
                <input v-model="form.province" list="seller-province-options" type="text" id="province" placeholder="Kigali" />
                <datalist id="seller-province-options">
                  <option v-for="province in provinceOptions" :key="province" :value="province" />
                </datalist>
              </div>

              <div class="form-group">
                <label for="district">District</label>
                <input
                  v-model="form.district"
                  list="seller-district-options"
                  type="text"
                  id="district"
                  @change="syncProvinceFromDistrict"
                />
                <datalist id="seller-district-options">
                  <option v-for="district in districtOptions" :key="district" :value="district" />
                </datalist>
              </div>

              <div class="form-group">
                <label for="sector">Sector</label>
                <input
                  v-model="form.sector"
                  list="seller-sector-options"
                  type="text"
                  id="sector"
                  @change="syncDistrictFromSector"
                />
                <datalist id="seller-sector-options">
                  <option v-for="sector in sectorOptions" :key="sector" :value="sector" />
                </datalist>
              </div>

              <div class="form-group">
                <label for="cell">Cell</label>
                <input v-model="form.cell" list="seller-cell-options" type="text" id="cell" />
                <datalist id="seller-cell-options">
                  <option v-for="cell in cellOptions" :key="cell" :value="cell" />
                </datalist>
              </div>

              <div class="form-group">
                <label for="village">Village</label>
                <input v-model="form.village" list="seller-village-options" type="text" id="village" />
                <datalist id="seller-village-options">
                  <option v-for="village in villageOptions" :key="village" :value="village" />
                </datalist>
              </div>

              <div class="form-group">
                <label for="addressLine">Street / Building</label>
                <input v-model="form.addressLine" list="seller-address-options" type="text" id="addressLine" />
                <datalist id="seller-address-options">
                  <option v-for="address in addressOptions" :key="address" :value="address" />
                </datalist>
              </div>
            </div>

            <div class="form-group">
              <label for="googleMapsUrl">Google Maps Link</label>
              <input
                v-model="form.googleMapsUrl"
                type="url"
                id="googleMapsUrl"
                placeholder="Paste a Google Maps link if you have one"
              />
            </div>

            <div class="form-group">
              <label for="googlePlaceId">Google Place ID</label>
              <input
                v-model="form.googlePlaceId"
                type="text"
                id="googlePlaceId"
                placeholder="Optional Google business place ID"
              />
            </div>

            <div v-if="showDetailedLocation" class="location-grid">
              <div class="form-group">
                <label for="latitude">Latitude</label>
                <input v-model="form.latitude" type="number" id="latitude" step="0.000001" />
              </div>

              <div class="form-group">
                <label for="longitude">Longitude</label>
                <input v-model="form.longitude" type="number" id="longitude" step="0.000001" />
              </div>
            </div>

          </div>

          <div class="form-group">
            <label for="googleRating">Google Rating</label>
            <input
              v-model.number="form.googleRating"
              type="number"
              id="googleRating"
              min="0"
              max="5"
              step="0.1"
              placeholder="Optional, 0 to 5"
            />
          </div>

          <div class="form-group">
            <label for="idnumber">National ID Number</label>
            <input 
              v-model="form.idnumber" 
              type="text" 
              id="idnumber" 
              required
            />
          </div>

          <div class="form-group">
            <label for="idphoto">Upload ID Photo</label>
            <input 
              @change="handlePhotoUpload"
              type="file" 
              id="idphoto"
              accept="image/*"
              required
            />
            <div v-if="form.idphoto" class="photo-preview">
              <img :src="form.idphoto" alt="ID Photo" />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              v-model="form.password" 
              type="password" 
              id="password" 
              required
            />
          </div>

          <button type="submit" class="btn btn-primary">Register as Seller</button>
        </form>

        <p class="login-link">
          Already have an account? 
          <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  RWANDA_DISTRICTS,
  buildLocationMeta,
  formatLocation,
  getAreaOptions,
  getDistrictOptions,
  getProvinceOptions,
  getSavedLocationOptions,
  getSectorOptions
} from '../utils/marketIntelligence.js'

const router = useRouter()
const locating = ref(false)
const savedLocationRecords = ref([])
const selectedAreaKey = ref('')
const showDetailedLocation = ref(false)

const form = ref({
  name: '',
  businessName: '',
  email: '',
  phone: '',
  location: '',
  province: 'Kigali',
  district: '',
  sector: '',
  cell: '',
  village: '',
  addressLine: '',
  googleMapsUrl: '',
  googlePlaceId: '',
  latitude: '',
  longitude: '',
  googleRating: '',
  idnumber: '',
  idphoto: '',
  password: ''
})

const loadSavedLocationRecords = () => {
  try {
    const buyers = JSON.parse(localStorage.getItem('buyers') || '[]')
    const sellers = JSON.parse(localStorage.getItem('sellers') || '[]')
    return [...buyers, ...sellers]
  } catch {
    return []
  }
}

savedLocationRecords.value = loadSavedLocationRecords()

const mergeOptions = (...groups) => {
  return [...new Set(groups.flat().map((item) => String(item || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
}

const shortLocationOptions = computed(() => getSavedLocationOptions(savedLocationRecords.value, 'location'))
const provinceOptions = computed(() => mergeOptions(['Kigali'], getProvinceOptions(), getSavedLocationOptions(savedLocationRecords.value, 'province')))
const districtOptions = computed(() => mergeOptions(getDistrictOptions(form.value.province), getSavedLocationOptions(savedLocationRecords.value, 'district')))
const sectorOptions = computed(() => mergeOptions(getSectorOptions(form.value.district), getSavedLocationOptions(savedLocationRecords.value, 'sector')))
const cellOptions = computed(() => getSavedLocationOptions(savedLocationRecords.value, 'cell'))
const villageOptions = computed(() => getSavedLocationOptions(savedLocationRecords.value, 'village'))
const addressOptions = computed(() => getSavedLocationOptions(savedLocationRecords.value, 'addressLine'))
const areaOptions = computed(() => getAreaOptions(savedLocationRecords.value))
const locationPreview = computed(() => {
  const parts = [form.value.addressLine, form.value.village, form.value.cell, form.value.sector, form.value.district, form.value.province]
    .map((part) => String(part || '').trim())
    .filter(Boolean)

  return parts.length ? [...new Set(parts)].join(', ') : form.value.location
})

const clean = (value = '') => String(value).trim().toLowerCase()

const syncProvinceFromDistrict = () => {
  const district = RWANDA_DISTRICTS.find((item) => clean(item.district) === clean(form.value.district))
  if (district) {
    form.value.province = district.province
  }
}

const syncDistrictFromSector = () => {
  const district = RWANDA_DISTRICTS.find((item) => {
    return Object.keys(item.sectors || {}).some((sector) => clean(sector) === clean(form.value.sector))
  })

  if (district) {
    form.value.district = form.value.district || district.district
    form.value.province = form.value.province || district.province
  }
}

const applySelectedArea = () => {
  const area = areaOptions.value.find((item) => item.key === selectedAreaKey.value)
  if (!area) return

  form.value.location = form.value.location || area.shortLabel || area.label
  form.value.province = area.province || form.value.province
  form.value.district = area.district || form.value.district
  form.value.sector = area.sector || form.value.sector
  form.value.cell = area.cell || form.value.cell
  form.value.village = area.village || form.value.village
  form.value.addressLine = area.addressLine || form.value.addressLine
  form.value.latitude = area.latitude || form.value.latitude
  form.value.longitude = area.longitude || form.value.longitude
}

const handlePhotoUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      form.value.idphoto = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

const useCurrentPosition = () => {
  if (!navigator.geolocation) {
    alert('Current position is not available in this browser.')
    return
  }

  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.value.latitude = Number(position.coords.latitude.toFixed(6))
      form.value.longitude = Number(position.coords.longitude.toFixed(6))
      locating.value = false
    },
    () => {
      locating.value = false
      alert('Could not get your current position. You can still enter the address manually.')
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  )
}

const registerSeller = () => {
  if (!form.value.idphoto) {
    alert('Please upload your ID photo!')
    return
  }

  // Get existing sellers from localStorage
  const sellers = JSON.parse(localStorage.getItem('sellers') || '[]')
  
  // Check if email already exists
  if (sellers.some(s => s.email === form.value.email)) {
    alert('Email already registered!')
    return
  }

  const locationMeta = buildLocationMeta(form.value)
  const fullLocation = formatLocation(locationMeta)

  // Create seller object
  const seller = {
    id: Date.now(),
    name: form.value.name,
    businessName: form.value.businessName,
    email: form.value.email,
    phone: form.value.phone,
    location: fullLocation,
    locationMeta,
    googleRating: Number(form.value.googleRating) || 0,
    idnumber: form.value.idnumber,
    idphoto: form.value.idphoto,
    password: form.value.password,
    products: [],
    registeredAt: new Date().toISOString()
  }

  // Save to localStorage
  sellers.push(seller)
  localStorage.setItem('sellers', JSON.stringify(sellers))
  
  // Save current user
  localStorage.setItem('currentUser', JSON.stringify({
    id: seller.id,
    name: seller.businessName,
    type: 'seller'
  }))

  alert('Registration successful! You can now add products.')
  router.push('/seller-dashboard')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  color: #2c3e50;
  text-decoration: none;
  font-weight: 600;
}

.form-container {
  max-width: 760px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.form-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.form-box h2 {
  color: #2c3e50;
  margin-top: 0;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.location-panel {
  background: #f8f9fa;
  border: 1px solid #e6e9ed;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  padding: 1rem;
}

.location-panel h3 {
  color: #2c3e50;
  font-size: 1rem;
  margin: 0 0 1rem;
}

.location-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.location-helper {
  align-items: end;
  display: grid;
  gap: 0.85rem;
  grid-template-columns: minmax(0, 1fr) auto auto;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #e74c3c;
}

.btn-location {
  background: #fff;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  color: #c0392b;
  cursor: pointer;
  font-weight: 700;
  padding: 0.7rem 1rem;
  width: auto;
}

.btn-location:disabled {
  cursor: wait;
  opacity: 0.7;
}

.btn-light {
  border-color: #bdc3c7;
  color: #2c3e50;
}

.location-preview {
  background: #fff;
  border: 1px solid #e6e9ed;
  border-radius: 6px;
  color: #2c3e50;
  font-weight: 700;
  margin: 0 0 1rem;
  padding: 0.75rem;
}

.photo-preview {
  margin-top: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
}

.photo-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #e74c3c;
  color: white;
}

.btn-primary:hover {
  background: #c0392b;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-link a {
  color: #e74c3c;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 700px) {
  .location-grid,
  .location-helper {
    grid-template-columns: 1fr;
  }
}
</style>
