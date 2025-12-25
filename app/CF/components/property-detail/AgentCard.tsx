'use client';

import Image from 'next/image';
import { Agent } from '../../types';
import { formatPhone } from '../../lib/formatters';

interface AgentCardProps {
  agent: Agent;
  onCall?: () => void;
  onWhatsApp?: () => void;
  onMessage?: () => void;
}

export function AgentCard({ agent, onCall, onWhatsApp, onMessage }: AgentCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
      {/* Agent Info */}
      <div className="flex items-start gap-4">
        {/* Photo */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
          <Image
            src={agent.photo}
            alt={agent.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{agent.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 text-sm truncate">{agent.agency.name}</span>
            {agent.agency.verified && (
              <span className="flex-shrink-0 flex items-center gap-1 text-blue-400 text-xs">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Onaylı
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
        <div className="text-xs text-gray-500 mb-1">Telefon</div>
        <a 
          href={`tel:${agent.phone}`}
          className="text-white font-medium hover:text-blue-400 transition-colors"
        >
          {formatPhone(agent.phone)}
        </a>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button 
          onClick={onCall}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Ara
        </button>
        <button 
          onClick={onWhatsApp}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </button>
      </div>

      {/* Message Form Trigger */}
      <button 
        onClick={onMessage}
        className="w-full mt-3 flex items-center justify-center gap-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Mesaj Gönder
      </button>
    </div>
  );
}

