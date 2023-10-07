import { createSlice } from '@reduxjs/toolkit'
import {banksData} from '../../banks.js'
import {ut} from '../../utils/utils.js'

const loadInitialState = () => {
    if(ut.isArray(banksData)){
        let bank = '',
            bankPads = []
        const availableBanks = banksData.reduce((res, obj)=>{
            if(ut.isStr(obj.name)){
                res.push(obj.name)
                if(bank === ''){
                    bank = obj.name
                }
                return res;
            }
        }, [])
        return {
            power: true,
            displayMsg: '',
            volume: 50,
            bank: bank,
            availableBanks: availableBanks,
            bankPads: bankPads,
        }
    }else{
        throw new Error('Redux Error : Unable to loadSoundBanks, invalid sound banks data. Must be an Array of Objects.')
    }
}

const drmMachineSlice = createSlice({
    name: 'mdPreviewer',
    initialState: loadInitialState(),
    reducers: {
        setSoundBank: {
            reducer(state, action) {
                // ✅ This "mutating" code is okay inside of createSlice!
                state.bank = action.payload.bank
                state.displayMsg = action.payload.display
                state.bankPads = action.payload.bankPads
            },
            prepare(bank) {
                if(ut.isArray(banksData)){

                    const selected = banksData.filter((obj)=>{
                        if(bank === obj.name){
                            return obj;
                        }
                    });

                    if(selected.length === 1){
                        if(! (ut.isStr(selected.display) || selected.display === '')){
                            throw new Error('Redux Error : Unable to setSoundBank, invalid sound banks data. banksData.display must be a string and not null.')
                        }

                        if(! ut.isArray(selected.bankPads) || selected.bankPads.length === 0){
                            throw new Error('Redux Error : Unable to setSoundBank, invalid sound banks data. banksData.bankPads must be an Array and not null.')
                        }

                        const display = selected.display,
                            bankPads = selected.bankPads
                        return {
                            payload: { bank, display, bankPads }
                        }
                    }else{
                        throw new Error('Redux Error : Unable to setSoundBank, invalid sound banks data. banksData.name must be unique and not null.')
                    }
                }else{
                    throw new Error('Redux Error : Unable to setSoundBank, invalid sound banks data. Must be an Array of Objects.')
                }

            }

        },
        setPower(state, action){
            const power = (action.power === true)
            state.power = power;
            state.displayMsg = (power === true) ? "Welcome to Drum Machine!!!" : "Good bye!!!"
        },
        setVolume(state, action){
            const volume = (ut.isNumber(action.volume)) ? parseInt(action.volume) : 25;
            state.volume = volume
            state.displayMsg = `Volume set to ${volume}%`
        },
        setDisplay(state, action){
            state.displayMsg = (ut.isStr(action.displayMsg)) ? action.displayMsg : "Bad Message";
        }
    }
})

export const { setSoundBank, setPower,  setVolume, setDisplay} = drmMachineSlice.actions

export const selectPower = state => state.drmMachine.power
export const selectDisplay = state => state.drmMachine.displayMsg
export const selectVolume = state => state.drmMachine.volume
export const selectBank = state => state.drmMachine.bank
export const selectAvailableBanks= state => state.drmMachine.availableBanks
export const selectBankPads= state => state.drmMachine.bankPads
export default drmMachineSlice.reducer