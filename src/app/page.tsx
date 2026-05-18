'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Download, Users, Trophy, TrendingUp } from 'lucide-react';

interface Eleve {
  matricule: string;
  nom: string;
  sexe: 'G' | 'F';
  Lecture: number;
  EE: number;
  ES: number;
  EST: number;
  Maths: number;
  Dictee: number;
  EAVivant: number;
  EAPlastique: number;
  EPS: number;
}

const matieres = ['Lecture', 'EE', 'ES', 'EST', 'Maths', 'Dictee', 'EAVivant', 'EAPlastique', 'EPS'] as const;

const listeElevesInit = [
  { matricule: "502626S0101", nom: "ADIDA Cossi Audrey", sexe: "G" },
  { matricule: "502626S0102", nom: "ADJERAN Amour", sexe: "G" },
  { matricule: "502626S0103", nom: "ADOMOU Mariame", sexe: "F" },
  { matricule: "502626S0104", nom: "AGBALE Audrey Juliette Gbemeho", sexe: "F" },
  { matricule: "502626S0105", nom: "AGBALE Restine Grâce", sexe: "F" },
  { matricule: "502626S0106", nom: "AGONSE Mahouklo Ida", sexe: "F" },
  { matricule: "502626S0107", nom: "AHAMIDÉ Gédéon", sexe: "G" },
  { matricule: "502626S0108", nom: "AHOUOU Signinli Pricil", sexe: "F" },
  { matricule: "502626S0109", nom: "AHOUANMON Enongandé Merveille", sexe: "F" },
  { matricule: "502626S0110", nom: "AHOUASSA Mardochée Gloire", sexe: "G" },
  { matricule: "502626S0111", nom: "AIDEOU Daniel", sexe: "G" },
  { matricule: "502626S0112", nom: "AKPOVI Mahugnon Ezéchiel", sexe: "G" },
  { matricule: "502626S0113", nom: "ALLAMIN Gbodja Joseph", sexe: "G" },
  { matricule: "502626S0114", nom: "ALLAMIN Tété Josephine", sexe: "F" },
  { matricule: "502626S0115", nom: "AMAGBEGNON Enangnon Ruffin", sexe: "G" },
  { matricule: "502626S0116", nom: "AMAGBEGNON Estelle", sexe: "F" },
  { matricule: "502626S0117", nom: "AMAGBEGNON Kossi Gratien", sexe: "G" },
  { matricule: "502626S0118", nom: "AROUKO Mahuklo Alida", sexe: "F" },
  { matricule: "502626S0119", nom: "ASSO Boni Salomon", sexe: "G" },
  { matricule: "502626S0120", nom: "AZILIMIN Prisca Nougnouin Mahouton", sexe: "F" },
  { matricule: "502626S0121", nom: "AZONGNIHOUE Ségnon Boniface", sexe: "G" },
  { matricule: "502626S0122", nom: "BIO Laima", sexe: "G" },
  { matricule: "502626S0123", nom: "BOCCO Sétondji Aurel", sexe: "G" },
  { matricule: "502626S0124", nom: "CHICOTO Dékounhoué Ruth Laure", sexe: "F" },
  { matricule: "502626S0125", nom: "CHICOTO Kpédeti Bernice", sexe: "F" },
  { matricule: "502626S0126", nom: "CHICOTO Midokpé Elvie-Chancel", sexe: "F" },
  { matricule: "502626S0127", nom: "DAMADA Fifamé Chancelle", sexe: "F" },
  { matricule: "502626S0128", nom: "DANHOUEGNON Tamegnon Cédolphe", sexe: "G" },
  { matricule: "502626S0129", nom: "DARI Victore", sexe: "F" },
  { matricule: "502626S0130", nom: "DASSOUNDO Sénoumatin Rose", sexe: "F" },
  { matricule: "502626S0131", nom: "DASSOUNDO Yvette", sexe: "F" },
  { matricule: "502626S0132", nom: "DEGREGNON Jacques", sexe: "G" },
  { matricule: "502626S0133", nom: "DEGBOHOUE Obed", sexe: "G" },
  { matricule: "502626S0134", nom: "DEGNI Dagbédé Nadège", sexe: "F" },
  { matricule: "502626S0135", nom: "DELIDJI Enongadé Belvie", sexe: "F" }
];

export default function CEPGestionnaire() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const initial: Eleve[] = listeElevesInit.map(e => ({
      ...e,
      Lecture: 0, EE: 0, ES: 0, EST: 0, Maths: 0,
      Dictee: 0, EAVivant: 0, EAPlastique: 0, EPS: 0
    }));
    setEleves(initial);
  }, []);

  const updateNote = (matricule: string, matiere: string, valeur: number) => {
    setEleves(prev => prev.map(e =>
      e.matricule === matricule
        ? { ...e, [matiere]: Math.max(0, Math.min(20, Number(valeur) || 0)) }
        : e
    ));
  };

  const calculerMoyenne = (e: Eleve): number => {
    const sum = matieres.reduce((acc, m) => acc + (e[m as keyof Eleve] as number), 0);
    return sum / 9;
  };

  const sortedEleves = [...eleves]
    .map(e => ({ ...e, moyenne: calculerMoyenne(e) }))
    .sort((a, b) => b.moyenne - a.moyenne);

  const filteredEleves = sortedEleves.filter(e =>
    e.nom.toLowerCase().includes(search.toLowerCase()) ||
    e.matricule.includes(search)
  );

  const moyenneClasse = (sortedEleves.reduce((sum, e) => sum + e.moyenne, 0) / sortedEleves.length || 0).toFixed(2);
  const admis = sortedEleves.filter(e => e.moyenne >= 10).length;

  const exportExcel = () => {
    const dataExport = sortedEleves.map((e, i) => ({
      Matricule: e.matricule,
      Nom: e.nom,
      Sexe: e.sexe,
      ...matieres.reduce((acc, m) => ({ ...acc, [m]: e[m as keyof Eleve] }), {}),
      Moyenne: e.moyenne.toFixed(2),
      Rang: i + 1
    }));

    const ws = XLSX.utils.json_to_sheet(dataExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Résultats CEP DJEGBE");
    XLSX.writeFile(wb, `CEP_DJEGBE_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">CEP DJEGBE</h1>
            <p className="text-xl text-gray-600">Gestionnaire d'Évaluation • CM2 • 2025-2026</p>
          </div>
          <button
            onClick={exportExcel}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-medium transition shadow-lg"
          >
            <Download className="w-5 h-5" />
            Exporter Excel
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow">
            <Users className="w-10 h-10 text-blue-600 mb-3" />
            <p className="text-4xl font-bold">{eleves.length}</p>
            <p className="text-gray-500">Élèves inscrits</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow">
            <Trophy className="w-10 h-10 text-green-600 mb-3" />
            <p className="text-4xl font-bold text-green-600">{admis}</p>
            <p className="text-gray-500">Admis (≥ 10/20)</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow">
            <TrendingUp className="w-10 h-10 text-purple-600 mb-3" />
            <p className="text-4xl font-bold">{moyenneClasse}</p>
            <p className="text-gray-500">Moyenne de la classe</p>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher par nom ou matricule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-4 text-left">Matricule</th>
                  <th className="p-4 text-left">Nom et Prénoms</th>
                  <th className="p-4 text-center">Sexe</th>
                  {matieres.map(m => (
                    <th key={m} className="p-4 text-center w-24">{m.replace('EE', 'E.E').replace('Dictee', 'Dictée')}</th>
                  ))}
                  <th className="p-4 text-center font-bold">Moyenne</th>
                  <th className="p-4 text-center">Rang</th>
                </tr>
              </thead>
              <tbody>
                {filteredEleves.map((eleve, index) => (
                  <tr key={eleve.matricule} className="border-b hover:bg-blue-50/50">
                    <td className="p-4 font-mono text-sm">{eleve.matricule}</td>
                    <td className="p-4 font-medium">{eleve.nom}</td>
                    <td className="p-4 text-center font-semibold">{eleve.sexe}</td>
                    {matieres.map(m => (
                      <td key={m} className="p-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.25"
                          value={eleve[m as keyof Eleve]}
                          onChange={(e) => updateNote(eleve.matricule, m, parseFloat(e.target.value))}
                          className="w-full text-center border rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                    ))}
                    <td className="p-4 text-center font-bold text-xl text-blue-600">
                      {eleve.moyenne.toFixed(2)}
                    </td>
                    <td className="p-4 text-center font-bold text-lg">{index + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Données sauvegardées automatiquement dans le navigateur • Centre DJEGBE
        </p>
      </div>
    </div>
  );
}
