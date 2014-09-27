require 'sinatra'
require_relative 'lib/renzu.rb'

# class Renzu::App < Sinatra::Application
#   configure :development do |c|
#     c.set :bind, '10.10.10.10'
#   end

  set :bind, '10.10.10.10'

  get '/' do
    send_file 'index.html'
    erb :calculate
  end

  post '/estimate' do
    @estimate = Renzu::Calculate.new(params["input-text"]).calculate
    erb :result
  end

  get '/' do
    redirect '/temps'
  end
# end
